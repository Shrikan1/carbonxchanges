const PDFDocument = require('pdfkit');

// Generates the certificate PDF into a Node stream that can be piped
// directly to an HTTP response — no temp file, no persistent storage.
// Regenerated fresh on every download request from the certificate's
// stored data, so there's nothing to keep in sync or go stale.
function streamCertificatePdf(certificateDetails, res) {
  const doc = new PDFDocument({ size: 'A4', margin: 60 });
  doc.pipe(res);

  doc.fontSize(22).font('Helvetica-Bold').text('Carbon Credit Retirement Certificate', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(12).font('Helvetica');
  const row = (label, value) => {
    doc.font('Helvetica-Bold').text(`${label}: `, { continued: true }).font('Helvetica').text(String(value));
    doc.moveDown(0.5);
  };

  row('Certificate ID', certificateDetails.id);
  row('Retired By', certificateDetails.buyer_name);
  row('Project', certificateDetails.project_title);
  row('Project Type', certificateDetails.project_type);
  row('Vintage Year', certificateDetails.vintage_year);
  row('Token ID (ERC-1155)', certificateDetails.token_id);
  row('Credits Retired', `${certificateDetails.amount} tCO2e`);
  row('Retirement Date', new Date(certificateDetails.retired_at).toISOString().split('T')[0]);
  row('Burn Transaction Hash', certificateDetails.burn_tx_hash);

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#555').text(
    'This certificate confirms the permanent retirement (on-chain burn) of the carbon credits listed above. ' +
    'The transaction hash can be independently verified on PolygonScan. Once retired, these credits cannot be resold or retired again.',
    { align: 'left' }
  );

  doc.end();
}

module.exports = { streamCertificatePdf };