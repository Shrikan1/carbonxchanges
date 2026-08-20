const PDFDocument = require('pdfkit');
const { getSignedUrl, BUCKETS } = require('./supabaseStorageService');
const { uploadFileToIPFS } = require('./ipfsService');
const axios = require('axios');

/**
 * Fetches an image from a URL and returns it as a Buffer.
 * Used to embed Supabase-hosted images into the PDF.
 */
async function fetchImageBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });
    return Buffer.from(response.data);
  } catch {
    return null; // if fetch fails, skip the image gracefully
  }
}

/**
 * Generates the full Project Verification PDF as a Buffer.
 * This document is the canonical evidence package that gets pinned to IPFS.
 *
 * Contents:
 *  - Full project details (type, location, methodology, CO2 claimed)
 *  - Owner identity (name, ID type, ID number, land ownership)
 *  - Aadhaar document image (embedded)
 *  - Land deed document image (embedded)
 *  - Agent initial verification (GPS, date, photo)
 *  - Agent completion verification (GPS, verified CO2, date, photo)
 *  - Platform certification statement
 *
 * @param {Object} project - Full project row (project_details joined)
 * @param {Object|null} initialReport - Initial verification report row
 * @param {Object|null} completionReport - Completion verification report row
 * @returns {Promise<Buffer>} PDF as a Buffer
 */
async function generateVerificationPdfBuffer(project, initialReport, completionReport) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 60, bufferPages: true });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const GREEN = '#1a6b3c';
      const DARK = '#1a1a2e';
      const GRAY = '#555555';
      const LINE_COLOR = '#e0e0e0';

      // ── Header ──────────────────────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 90).fill(GREEN);
      doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
        .text('CarbonXchanges', 60, 22);
      doc.fontSize(11).font('Helvetica')
        .text('Verified Project Certificate', 60, 48);
      doc.fontSize(9)
        .text(`Generated: ${new Date().toISOString()}`, 60, 66);
      doc.moveDown(3);

      // Helper: section header
      const sectionHeader = (title) => {
        doc.moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).stroke(LINE_COLOR);
        doc.moveDown(0.3);
        doc.fillColor(GREEN).fontSize(13).font('Helvetica-Bold').text(title);
        doc.moveDown(0.4);
      };

      // Helper: labelled row
      const row = (label, value) => {
        if (!value && value !== 0) return;
        doc.fillColor(GRAY).fontSize(9).font('Helvetica-Bold')
          .text(label, { continued: true });
        doc.fillColor(DARK).font('Helvetica')
          .text(`  ${String(value)}`);
        doc.moveDown(0.2);
      };

      // ── Section 1: Project Information ──────────────────────────────────────
      sectionHeader('PROJECT INFORMATION');
      row('Title', project.title);
      row('Project Type', project.project_type?.replace(/_/g, ' ').toUpperCase());
      row('Scale', project.project_scale);
      row('Project ID', project.id);
      row('Country', project.country);
      row('State / Region', project.state_region);
      row('Latitude', project.latitude);
      row('Longitude', project.longitude);
      row('Total Area (hectares)', project.total_project_area_hectares);
      row('Eligible Area (hectares)', project.eligible_area_hectares);
      row('Climate Zone', project.climate_zone);
      row('Soil Type', project.soil_type);
      row('Hydrology Status', project.hydrology_status);
      row('Land Title Status', project.land_title_status);
      row('Start Date', project.project_start_date);
      row('Duration (months)', project.duration_months);
      row('Crediting Period', project.crediting_period_months ? `${project.crediting_period_months} months` : 'N/A');
      row('Expected Completion', project.expected_completion_date);
      doc.moveDown(0.5);

      // ── Section 2: Methodology ───────────────────────────────────────────────
      sectionHeader('METHODOLOGY');
      row('Methodology Applied', project.methodology_applied);
      row('Total CO2 Claimed (tCO2e)', project.total_co2_claimed);
      row('Estimated VERs', project.estimated_vers);
      row('GHG Sources Included', project.ghg_sources_included);
      row('Additionality Demonstration', project.additionality_demonstration);
      row('Monitoring Frequency', project.monitoring_frequency);
      row('SDG Targets', project.sdg_targets);
      doc.moveDown(0.5);

      // Embed methodology-specific data if present
      if (project.methodology_specific_data) {
        const msd = typeof project.methodology_specific_data === 'string'
          ? JSON.parse(project.methodology_specific_data)
          : project.methodology_specific_data;
        if (Object.keys(msd).length > 0) {
          sectionHeader('TYPE-SPECIFIC DATA');
          Object.entries(msd).forEach(([k, v]) => {
            row(k.replace(/_/g, ' '), v);
          });
          doc.moveDown(0.5);
        }
      }

      // ── Section 3: Project Summary ───────────────────────────────────────────
      if (project.project_summary) {
        sectionHeader('PROJECT SUMMARY');
        doc.fillColor(DARK).fontSize(9).font('Helvetica').text(project.project_summary, {
          align: 'left', lineGap: 3,
        });
        doc.moveDown(0.5);
      }

      // ── Section 4: Stakeholders ──────────────────────────────────────────────
      if (project.stakeholder_consultation_summary || project.grievance_mechanism) {
        sectionHeader('STAKEHOLDER ENGAGEMENT');
        row('Consultation Summary', project.stakeholder_consultation_summary);
        row('Grievance Mechanism', project.grievance_mechanism);
        doc.moveDown(0.5);
      }

      // ── Section 5: Owner & Legal Identity ───────────────────────────────────
      doc.addPage();
      sectionHeader('OWNER & LEGAL IDENTITY');
      row('Full Name', project.owner_full_name);
      row('ID Type', project.owner_id_type);
      row('ID Number', project.owner_id_number);
      row('Land Ownership Type', project.land_ownership_type);
      doc.moveDown(0.5);

      // Embed Aadhaar document
      if (project.aadhaar_doc_path) {
        try {
          const signedUrl = await getSignedUrl(BUCKETS.KYC_DOCS, project.aadhaar_doc_path, 300);
          const imgBuffer = await fetchImageBuffer(signedUrl);
          if (imgBuffer) {
            doc.fillColor(GREEN).fontSize(10).font('Helvetica-Bold').text('Aadhaar Document:');
            doc.moveDown(0.3);
            doc.image(imgBuffer, { fit: [440, 280], align: 'center' });
            doc.moveDown(1);
          }
        } catch (e) {
          row('Aadhaar Document', '[Could not embed — see secure Supabase storage]');
        }
      }

      // Embed Land Deed
      if (project.land_deed_path) {
        try {
          const signedUrl = await getSignedUrl(BUCKETS.KYC_DOCS, project.land_deed_path, 300);
          const imgBuffer = await fetchImageBuffer(signedUrl);
          if (imgBuffer) {
            doc.fillColor(GREEN).fontSize(10).font('Helvetica-Bold').text('Land Deed / Ownership Document:');
            doc.moveDown(0.3);
            doc.image(imgBuffer, { fit: [440, 280], align: 'center' });
            doc.moveDown(1);
          }
        } catch (e) {
          row('Land Deed', '[Could not embed — see secure Supabase storage]');
        }
      }

      // ── Section 6: Initial Verification (Agent) ──────────────────────────────
      doc.addPage();
      sectionHeader('INITIAL FIELD VERIFICATION (Agent)');
      if (initialReport) {
        row('Agent ID', initialReport.agent_id);
        row('Verification Date', initialReport.submitted_at?.toISOString?.()?.split('T')[0] ?? '');
        row('GPS Latitude', initialReport.gps_lat);
        row('GPS Longitude', initialReport.gps_lng);
        row('Notes', initialReport.notes);
        doc.moveDown(0.5);
        if (initialReport.photo_url) {
          try {
            const signedUrl = await getSignedUrl(BUCKETS.VERIFY_PHOTOS, initialReport.photo_url, 300);
            const imgBuffer = await fetchImageBuffer(signedUrl);
            if (imgBuffer) {
              doc.fillColor(GREEN).fontSize(10).font('Helvetica-Bold').text('Field Photo:');
              doc.moveDown(0.3);
              doc.image(imgBuffer, { fit: [440, 260], align: 'center' });
              doc.moveDown(1);
            }
          } catch {
            row('Field Photo', '[Could not embed]');
          }
        }
      } else {
        doc.fillColor(GRAY).fontSize(9).text('No initial verification report on file.');
      }
      doc.moveDown(0.5);

      // ── Section 7: Completion Verification (Agent) ───────────────────────────
      sectionHeader('COMPLETION VERIFICATION (Agent)');
      if (completionReport) {
        row('Agent ID', completionReport.agent_id);
        row('Verification Date', completionReport.submitted_at?.toISOString?.()?.split('T')[0] ?? '');
        row('GPS Latitude', completionReport.gps_lat);
        row('GPS Longitude', completionReport.gps_lng);
        row('Verified CO2 Amount (tCO2e)', completionReport.verified_co2_amount);
        row('Notes', completionReport.notes);
        doc.moveDown(0.5);
        if (completionReport.photo_url) {
          try {
            const signedUrl = await getSignedUrl(BUCKETS.VERIFY_PHOTOS, completionReport.photo_url, 300);
            const imgBuffer = await fetchImageBuffer(signedUrl);
            if (imgBuffer) {
              doc.fillColor(GREEN).fontSize(10).font('Helvetica-Bold').text('Completion Field Photo:');
              doc.moveDown(0.3);
              doc.image(imgBuffer, { fit: [440, 260], align: 'center' });
              doc.moveDown(1);
            }
          } catch {
            row('Field Photo', '[Could not embed]');
          }
        }
      } else {
        doc.fillColor(GRAY).fontSize(9).text('No completion verification report on file.');
      }

      // ── Footer: Certification Statement ──────────────────────────────────────
      doc.addPage();
      doc.rect(0, 0, doc.page.width, 90).fill(GREEN);
      doc.fillColor('white').fontSize(16).font('Helvetica-Bold')
        .text('Platform Certification', 60, 30, { align: 'center' });
      doc.moveDown(3);

      doc.fillColor(DARK).fontSize(10).font('Helvetica').text(
        'This document certifies that the above-referenced carbon reduction project has been:\n\n' +
        '1. Registered and reviewed by CarbonXchanges platform administrators.\n' +
        '2. Assigned to an accredited field verification agent.\n' +
        '3. Physically verified on-site (initial and completion stages).\n' +
        '4. Approved by CarbonXchanges administration.\n\n' +
        'The verified CO2 reduction amounts have been minted as ERC-1155 carbon credit tokens on ' +
        'the Polygon blockchain. The token metadata references this document via its IPFS CID, ' +
        'making the project evidence permanently and immutably linked to the on-chain credits.\n\n' +
        'This document is stored on IPFS (InterPlanetary File System) and is content-addressed — ' +
        'meaning its IPFS CID uniquely identifies this exact document. Any modification would ' +
        'produce a different CID, making tampering detectable.\n\n' +
        'Verified on: ' + new Date().toISOString(),
        { align: 'left', lineGap: 4 }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates the verification PDF, uploads it to IPFS via Pinata,
 * and returns the IPFS CID.
 *
 * @param {Object} project - Full project row
 * @param {Object|null} initialReport
 * @param {Object|null} completionReport
 * @returns {Promise<string>} IPFS CID of the PDF
 */
async function generateAndPinVerificationPdf(project, initialReport, completionReport) {
  const pdfBuffer = await generateVerificationPdfBuffer(project, initialReport, completionReport);
  const fileName = `carbonxchanges-verification-project-${project.id}.pdf`;
  const cid = await uploadFileToIPFS(pdfBuffer, fileName);
  return cid;
}

module.exports = { generateAndPinVerificationPdf };
