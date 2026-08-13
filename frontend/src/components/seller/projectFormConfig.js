
export const PROJECT_FORM_STEPS = [
  {
    step: 1,
    title: 'Basic Info',
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      {
        name: 'project_type', label: 'Project Type', type: 'select', required: true,
        options: ['reforestation', 'afforestation', 'mangrove_restoration', 'redd+', 'soil_carbon', 'renewable_energy', 'methane_capture', 'other'],
      },
      { name: 'project_scale', label: 'Project Scale', type: 'select', required: true, options: ['small-scale', 'large-scale'] },
      { name: 'duration_years', label: 'Duration (years)', type: 'number' },
      { name: 'crediting_period_years', label: 'Crediting Period (years)', type: 'number' },
      { name: 'project_start_date', label: 'Project Start Date', type: 'date' },
      { name: 'project_summary', label: 'Project Summary', type: 'textarea' },
      { name: 'funding_sources', label: 'Funding Sources', type: 'text' },
      { name: 'publicly_funded', label: 'Publicly Funded', type: 'checkbox' },
    ],
  },
  {
    step: 2,
    title: 'Location',
    fields: [
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'state_region', label: 'State / Region', type: 'text' },
      { name: 'latitude', label: 'Latitude', type: 'number' },
      { name: 'longitude', label: 'Longitude', type: 'number' },
      { name: 'total_project_area_hectares', label: 'Total Project Area (hectares)', type: 'number', required: true },
      { name: 'eligible_area_hectares', label: 'Eligible Area (hectares)', type: 'number' },
      { name: 'set_aside_conservation_percent', label: 'Set-Aside Conservation (%)', type: 'number' },
      { name: 'climate_zone', label: 'Climate Zone', type: 'text' },
      { name: 'soil_type', label: 'Soil Type', type: 'text' },
      { name: 'hydrology_status', label: 'Hydrology Status', type: 'text' },
      { name: 'land_title_status', label: 'Land Title Status', type: 'text' },
    ],
  },
  {
    step: 3,
    title: 'Ecological Data',
    fields: [
      { name: 'dominant_species', label: 'Dominant Species', type: 'text' },
      { name: 'species_type', label: 'Species Type', type: 'text' },
      { name: 'measurement_season', label: 'Measurement Season', type: 'text' },
      { name: 'above_ground_biomass', label: 'Above-Ground Biomass', type: 'number' },
      { name: 'below_ground_biomass', label: 'Below-Ground Biomass', type: 'number' },
      { name: 'soil_organic_carbon_0_30cm', label: 'Soil Organic Carbon (0–30cm)', type: 'number' },
      { name: 'soil_organic_carbon_30_100cm', label: 'Soil Organic Carbon (30–100cm)', type: 'number' },
      { name: 'dead_wood_carbon', label: 'Dead Wood Carbon', type: 'number' },
      { name: 'litter_carbon', label: 'Litter Carbon', type: 'number' },
      { name: 'sampling_plots', label: 'Sampling Plots', type: 'number' },
      { name: 'biodiversity_index', label: 'Biodiversity Index', type: 'number' },
      { name: 'uncertainty_percentage', label: 'Uncertainty (%)', type: 'number' },
    ],
  },
  {
    step: 4,
    title: 'Methodology',
    fields: [
      { name: 'technologies_measures_description', label: 'Technologies / Measures Description', type: 'textarea' },
      { name: 'methodology_applied', label: 'Methodology Applied', type: 'text', required: true },
      { name: 'ghg_sources_included', label: 'GHG Sources Included', type: 'textarea' },
      { name: 'baseline_scenario', label: 'Baseline Scenario', type: 'textarea' },
      { name: 'additionality_demonstration', label: 'Additionality Demonstration', type: 'textarea' },
      { name: 'sdg_targets', label: 'SDG Targets', type: 'text' },
      { name: 'total_co2_claimed', label: 'Total CO2 Claimed (tonnes)', type: 'number', required: true },
      { name: 'estimated_vers', label: 'Estimated VERs', type: 'number' },
      { name: 'monitoring_frequency', label: 'Monitoring Frequency', type: 'text' },
      { name: 'responsible_person', label: 'Responsible Person / Institution', type: 'text' },
      { name: 'stakeholder_consultation_summary', label: 'Stakeholder Consultation Summary', type: 'textarea' },
      { name: 'grievance_mechanism', label: 'Grievance Mechanism', type: 'textarea' },
    ],
  },
  {
    step: 5,
    title: 'Owner & Legal',
    fields: [
      { name: 'owner_full_name', label: 'Owner Full Name', type: 'text', required: true },
      { name: 'owner_id_type', label: 'ID Type', type: 'text', required: true },
      { name: 'owner_id_number', label: 'ID Number', type: 'text', required: true },
      { name: 'land_ownership_type', label: 'Land Ownership Type', type: 'text', required: true },
      // Deferred to a follow-up section: this should become a real file
      // upload through /api/upload (Pinata), returning a CID to store here.
      // Plain text input for now so the wizard is usable end-to-end.
      { name: 'live_verification_photo_ipfs_cid', label: 'Land Verification Photo (IPFS CID)', type: 'text' },
    ],
  },
];

// Flat initial state object with every field defaulted — checkboxes false,
// everything else empty string (converted/stripped before the API call).
export function getInitialFormData() {
  const data = {};
  for (const group of PROJECT_FORM_STEPS) {
    for (const field of group.fields) {
      data[field.name] = field.type === 'checkbox' ? false : '';
    }
  }
  return data;
}