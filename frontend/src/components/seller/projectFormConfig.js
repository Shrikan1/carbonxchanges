// ─── Shared steps shown for every project type ──────────────────────────────

const STEP_BASIC_INFO = {
  step: 1,
  title: 'Basic Info',
  fields: [
    {
      name: 'title', label: 'Project Title', type: 'text', required: true,
      description: 'The full official name of your carbon reduction project.',
    },
    {
      name: 'project_type', label: 'Project Type', type: 'select', required: true,
      description: 'Choose the category that best describes your project\'s primary activity.',
      options: [
        { value: 'reforestation',         label: 'Reforestation' },
        { value: 'afforestation',         label: 'Afforestation' },
        { value: 'mangrove_restoration',  label: 'Mangrove Restoration' },
        { value: 'redd+',                 label: 'REDD+' },
        { value: 'soil_carbon',           label: 'Soil Carbon' },
        { value: 'renewable_energy',      label: 'Renewable Energy' },
        { value: 'methane_capture',       label: 'Methane Capture' },
        { value: 'other',                 label: 'Other' },
      ],
    },
    {
      name: 'project_scale', label: 'Project Scale', type: 'select', required: true,
      description: 'Small-scale projects typically produce under 15,000 tCO2e/year; large-scale exceed that.',
      options: [
        { value: 'small-scale', label: 'Small-Scale' },
        { value: 'large-scale', label: 'Large-Scale' },
      ],
    },
    {
      name: 'duration_months', label: 'Duration (months)', type: 'number', min: 1, max: 1200, required: true,
      description: 'Total number of months the project will actively operate and sequester carbon.',
    },
    {
      name: 'crediting_period_months', label: 'Crediting Period (months)', type: 'number', min: 1, max: 1200, required: true,
      description: 'The number of months for which carbon credits will be officially issued.',
    },
    {
      name: 'project_start_date', label: 'Project Start Date', type: 'date', required: true,
      description: 'The date on which project activities formally began (or are planned to begin).',
    },
    {
      name: 'project_summary', label: 'Project Summary', type: 'textarea',
      description: 'A 2–5 sentence overview of the project goals, methods, location, and expected impact.',
    },
    {
      name: 'funding_sources', label: 'Funding Sources', type: 'text',
      description: 'List all sources of funding — government grants, private equity, NGO support, loans, etc.',
    },
    { name: 'publicly_funded', label: 'Publicly Funded', type: 'checkbox' },
  ],
};

const STEP_LOCATION = {
  step: 2,
  title: 'Location',
  fields: [
    {
      name: 'country', label: 'Country', type: 'text', required: true,
      description: 'The country where the project site is physically located.',
    },
    {
      name: 'state_region', label: 'State / Region', type: 'text',
      description: 'State, province, or administrative region within the country.',
    },
    {
      name: 'latitude', label: 'Latitude', type: 'number', min: -90, max: 90,
      description: 'GPS latitude of the project centroid (decimal degrees, –90 to +90).',
    },
    {
      name: 'longitude', label: 'Longitude', type: 'number', min: -180, max: 180,
      description: 'GPS longitude of the project centroid (decimal degrees, –180 to +180).',
    },
    {
      name: 'total_project_area_hectares', label: 'Total Project Area (hectares)', type: 'number',
      min: 0.01, required: true,
      description: 'The total land area covered by the project boundary, in hectares.',
    },
    {
      name: 'eligible_area_hectares', label: 'Eligible Area (hectares)', type: 'number', min: 0.01,
      description: 'The portion of the total area that qualifies for carbon credit generation.',
    },
    {
      name: 'set_aside_conservation_percent', label: 'Set-Aside Conservation (%)', type: 'number',
      min: 0, max: 100,
      description: 'Percentage of land reserved for conservation (not used for credit generation).',
    },
    {
      name: 'climate_zone', label: 'Climate Zone', type: 'text',
      description: 'Köppen climate classification or descriptive zone (e.g. Tropical Rainforest, Semi-Arid).',
    },
    {
      name: 'soil_type', label: 'Soil Type', type: 'text',
      description: 'Dominant soil classification at the project site (e.g. Oxisol, Vertisol, Alluvial).',
    },
    {
      name: 'hydrology_status', label: 'Hydrology Status', type: 'text',
      description: 'Describe water availability, river systems, seasonal flooding, or drought risk.',
    },
    {
      name: 'land_title_status', label: 'Land Title Status', type: 'text',
      description: 'Legal status of land ownership (e.g. Registered freehold, Government lease, Community trust).',
    },
  ],
};

// ─── Type-specific data steps ─────────────────────────────────────────────────

/** Nature-based / Forestry: Reforestation, Afforestation, Mangrove, REDD+, Soil Carbon */
const STEP_ECOLOGICAL_DATA = {
  step: 3,
  title: 'Ecological Data',
  typeSpecific: true,
  fields: [
    {
      name: 'dominant_species', label: 'Dominant Species', type: 'text',
      description: 'Scientific or common name of the primary tree/plant species in the project area.',
    },
    {
      name: 'species_type', label: 'Species Type', type: 'text',
      description: 'Broad classification of species — native broadleaf, conifer, mangrove, mixed, etc.',
    },
    {
      name: 'measurement_season', label: 'Measurement Season', type: 'text',
      description: 'The season during which biomass measurements are taken (e.g. Dry season, Post-monsoon).',
    },
    {
      name: 'above_ground_biomass', label: 'Above-Ground Biomass (t/ha)', type: 'number', min: 0,
      description: 'Total above-ground dry biomass per hectare, measured via field inventory.',
    },
    {
      name: 'below_ground_biomass', label: 'Below-Ground Biomass (t/ha)', type: 'number', min: 0,
      description: 'Below-ground root biomass per hectare — typically estimated as a ratio of above-ground biomass.',
    },
    {
      name: 'soil_organic_carbon_0_30cm', label: 'Soil Organic Carbon 0–30cm (tC/ha)', type: 'number', min: 0,
      description: 'Organic carbon stock in the top 30 cm of soil, measured per hectare.',
    },
    {
      name: 'soil_organic_carbon_30_100cm', label: 'Soil Organic Carbon 30–100cm (tC/ha)', type: 'number', min: 0,
      description: 'Organic carbon stock between 30 and 100 cm soil depth, per hectare.',
    },
    {
      name: 'dead_wood_carbon', label: 'Dead Wood Carbon (tC/ha)', type: 'number', min: 0,
      description: 'Carbon stored in standing dead trees and fallen logs per hectare.',
    },
    {
      name: 'litter_carbon', label: 'Litter Carbon (tC/ha)', type: 'number', min: 0,
      description: 'Carbon in leaf litter, fine woody debris, and organic surface material per hectare.',
    },
    {
      name: 'sampling_plots', label: 'Number of Sampling Plots', type: 'number', min: 1,
      description: 'Total number of field sample plots used for biomass inventory measurements.',
    },
    {
      name: 'biodiversity_index', label: 'Biodiversity Index', type: 'number', min: 0,
      description: 'Shannon diversity index or equivalent measure of species richness at the site.',
    },
    {
      name: 'uncertainty_percentage', label: 'Uncertainty (%)', type: 'number', min: 0, max: 100,
      description: 'Statistical uncertainty of the carbon stock estimate (as a percentage, 0–100).',
    },
  ],
};

/** Renewable Energy */
const STEP_ENERGY_DATA = {
  step: 3,
  title: 'Energy Data',
  typeSpecific: true,
  fields: [
    {
      name: 'energy_source_type', label: 'Energy Source Type', type: 'select',
      description: 'Select the primary renewable energy technology used at this project.',
      options: [
        { value: 'solar_pv',    label: 'Solar PV' },
        { value: 'wind',        label: 'Wind' },
        { value: 'small_hydro', label: 'Small Hydro' },
        { value: 'biomass',     label: 'Biomass' },
        { value: 'geothermal',  label: 'Geothermal' },
        { value: 'other',       label: 'Other' },
      ],
    },
    {
      name: 'installed_capacity_mw', label: 'Installed Capacity (MW)', type: 'number', min: 0.001,
      description: 'Total nameplate (peak) capacity of the installed generation equipment in Megawatts.',
    },
    {
      name: 'annual_generation_mwh', label: 'Estimated Annual Generation (MWh/year)', type: 'number', min: 1,
      description: 'Expected electricity output per year under normal operating conditions.',
    },
    {
      name: 'grid_emission_factor', label: 'Grid Emission Factor (tCO2/MWh)', type: 'number', min: 0,
      description: 'The CO2 intensity of the regional electricity grid being displaced. Used to calculate emission reductions.',
    },
    {
      name: 'plant_load_factor_percent', label: 'Plant Load Factor (%)', type: 'number', min: 0, max: 100,
      description: 'Ratio of actual generation to maximum possible generation (capacity utilisation), as a percentage.',
    },
    {
      name: 'technology_subtype', label: 'Technology Subtype / Model', type: 'text',
      description: 'Specific technology details — panel type, turbine model, or engineering specifications.',
    },
    {
      name: 'grid_connectivity', label: 'Grid Connectivity', type: 'text',
      description: 'State whether the project is on-grid (connected to utility) or off-grid (isolated microgrid).',
    },
  ],
};

/** Methane Capture */
const STEP_METHANE_DATA = {
  step: 3,
  title: 'Methane Capture Data',
  typeSpecific: true,
  fields: [
    {
      name: 'waste_source_type', label: 'Waste Source Type', type: 'select',
      description: 'Select the origin of the methane being captured and destroyed.',
      options: [
        { value: 'landfill',      label: 'Municipal Landfill' },
        { value: 'agriculture',   label: 'Agricultural Waste' },
        { value: 'coal_mine',     label: 'Coal Mine Methane' },
        { value: 'wastewater',    label: 'Wastewater Treatment' },
        { value: 'livestock',     label: 'Livestock Manure' },
        { value: 'other',         label: 'Other' },
      ],
    },
    {
      name: 'waste_volume_tonnes_year', label: 'Waste Volume Processed (tonnes/year)', type: 'number', min: 1,
      description: 'Total weight of waste material processed through the capture system per year.',
    },
    {
      name: 'methane_concentration_percent', label: 'Methane Concentration (%)', type: 'number', min: 0, max: 100,
      description: 'Average methane content of the gas stream entering the capture system (0–100%).',
    },
    {
      name: 'destruction_efficiency_percent', label: 'Destruction Efficiency (%)', type: 'number', min: 0, max: 100,
      description: 'Percentage of captured methane that is successfully destroyed or converted (0–100%).',
    },
    {
      name: 'energy_recovery_mwh_year', label: 'Energy Recovered (MWh/year)', type: 'number', min: 0,
      description: 'Electricity or heat generated from the captured methane per year, if applicable.',
    },
    {
      name: 'capture_technology', label: 'Capture Technology', type: 'text',
      description: 'Describe the equipment used — enclosed flare, biogas engine, membrane system, etc.',
    },
  ],
};

/** Soil Carbon (standalone) */
const STEP_SOIL_DATA = {
  step: 3,
  title: 'Soil Carbon Data',
  typeSpecific: true,
  fields: [
    {
      name: 'soil_carbon_method', label: 'Measurement Method', type: 'text',
      description: 'Laboratory method used to measure soil organic carbon (e.g. Walkley-Black, Loss-on-ignition).',
    },
    {
      name: 'baseline_soc_tonnes_ha', label: 'Baseline Soil Organic Carbon (tC/ha)', type: 'number', min: 0,
      description: 'Soil organic carbon stock at the project start date, before any interventions.',
    },
    {
      name: 'improved_practice', label: 'Improved Agricultural Practice', type: 'text',
      description: 'Describe the land management change being implemented (e.g. no-till, cover cropping, compost).',
    },
    {
      name: 'soil_sampling_depth_cm', label: 'Sampling Depth (cm)', type: 'number', min: 1,
      description: 'Soil core depth used for carbon measurement (typically 30 cm or 100 cm).',
    },
    {
      name: 'carbon_stock_change_rate', label: 'Carbon Stock Change Rate (tC/ha/year)', type: 'number', min: 0,
      description: 'Annual rate of soil carbon increase attributed to the improved land management practice.',
    },
    {
      name: 'sampling_plots', label: 'Number of Sampling Plots', type: 'number', min: 1,
      description: 'Number of georeferenced plots from which soil cores were collected for analysis.',
    },
    {
      name: 'uncertainty_percentage', label: 'Uncertainty (%)', type: 'number', min: 0, max: 100,
      description: 'Statistical uncertainty of the carbon stock change estimate (as a percentage).',
    },
  ],
};

/** Other / Custom */
const STEP_CUSTOM_DATA = {
  step: 3,
  title: 'Project-Specific Data',
  typeSpecific: true,
  fields: [
    {
      name: 'custom_methodology_notes', label: 'Custom Methodology Notes', type: 'textarea',
      description: 'Describe your specific technical approach, measurement methods, and any unique aspects of your methodology not covered by the standard categories.',
    },
  ],
};

// ─── Shared steps ──────────────────────────────────────────────────────────────

const STEP_METHODOLOGY = {
  step: 4,
  title: 'Methodology',
  fields: [
    {
      name: 'technologies_measures_description', label: 'Technologies / Measures Description', type: 'textarea',
      description: 'Describe the technologies, practices, or physical interventions being implemented.',
    },
    {
      name: 'methodology_applied', label: 'Methodology Applied', type: 'text', required: true,
      description: 'The official carbon standard and methodology ID (e.g. Verra VCS VM0007, Gold Standard AMS-I.D).',
    },
    {
      name: 'ghg_sources_included', label: 'GHG Sources Included', type: 'textarea',
      description: 'List which greenhouse gas sources, sinks, and reservoirs are within the project boundary.',
    },
    {
      name: 'baseline_scenario', label: 'Baseline Scenario', type: 'textarea',
      description: 'Describe the most likely land use or emission scenario that would have occurred without this project.',
    },
    {
      name: 'additionality_demonstration', label: 'Additionality Demonstration', type: 'textarea',
      description: 'Explain why this project would not have happened without carbon finance — regulatory, financial, and technical barriers.',
    },
    {
      name: 'sdg_targets', label: 'SDG Targets', type: 'text',
      description: 'List the UN Sustainable Development Goals this project contributes to (e.g. SDG 13, SDG 15, SDG 8).',
    },
    {
      name: 'total_co2_claimed', label: 'Total CO2 Claimed (tCO2e)', type: 'number', min: 1, required: true,
      description: 'Total tonnes of CO2 equivalent reductions expected over the entire crediting period.',
    },
    {
      name: 'estimated_vers', label: 'Estimated VERs', type: 'number', min: 1,
      description: 'Number of Voluntary Emission Reductions expected to be issued as tradeable credits.',
    },
    {
      name: 'monitoring_frequency', label: 'Monitoring Frequency', type: 'text',
      description: 'How often the project will be monitored and reported (e.g. annual, bi-annual, continuous satellite).',
    },
    {
      name: 'responsible_person', label: 'Responsible Person / Institution', type: 'text',
      description: 'Full name and organisation of the primary technical contact for this project.',
    },
    {
      name: 'stakeholder_consultation_summary', label: 'Stakeholder Consultation Summary', type: 'textarea',
      description: 'Summarise community engagement activities, Free Prior Informed Consent (FPIC) processes, and outcomes.',
    },
    {
      name: 'grievance_mechanism', label: 'Grievance Mechanism', type: 'textarea',
      description: 'Describe how local communities or affected parties can raise concerns, complaints, or disputes.',
    },
  ],
};

const STEP_OWNER_LEGAL = {
  step: 5,
  title: 'Owner & Legal',
  fields: [
    {
      name: 'owner_full_name', label: 'Owner Full Name', type: 'text', required: true,
      description: 'Full legal name of the project owner exactly as it appears on their government ID.',
    },
    {
      name: 'owner_id_type', label: 'ID Type', type: 'text', required: true,
      description: 'Type of government-issued ID provided (e.g. Aadhaar, Passport, PAN Card, National ID).',
    },
    {
      name: 'owner_id_number', label: 'ID Number', type: 'text', required: true,
      description: 'The unique identification number printed on the submitted government ID document.',
    },
    {
      name: 'land_ownership_type', label: 'Land Ownership Type', type: 'text', required: true,
      description: 'Legal basis of land ownership (e.g. Freehold, Leasehold, Community trust, Government allotment).',
    },
    {
      name: 'aadhaar_doc',
      label: 'Aadhaar / Government ID Document',
      type: 'file',
      accept: 'image/jpeg,image/png,image/webp,application/pdf',
      kycPurpose: 'aadhaar',
      description: 'Upload a clear scan or photo of your government-issued ID. Used by admin to verify owner identity. Stored securely and never made public.',
      hint: 'JPG, PNG or PDF · Max 15 MB',
    },
    {
      name: 'land_deed',
      label: 'Land Deed / Ownership Proof',
      type: 'file',
      accept: 'image/jpeg,image/png,image/webp,application/pdf',
      kycPurpose: 'land_deed',
      description: 'Upload the land deed, title certificate, or official ownership document for the project site.',
      hint: 'JPG, PNG or PDF · Max 15 MB',
    },
    {
      name: 'live_verification_photo',
      label: 'Live Verification Photo (Project Site)',
      type: 'file',
      accept: 'image/jpeg,image/png,image/webp',
      kycPurpose: 'verification_photo',
      description: 'A recent photo taken at the project site with the owner clearly visible. Confirms physical presence on land.',
      hint: 'JPG or PNG · Max 15 MB',
    },
  ],
};

// ─── Which type-specific step to show per project_type ───────────────────────

export const TYPE_TO_STEP3 = {
  reforestation:        STEP_ECOLOGICAL_DATA,
  afforestation:        STEP_ECOLOGICAL_DATA,
  mangrove_restoration: STEP_ECOLOGICAL_DATA,
  'redd+':              STEP_ECOLOGICAL_DATA,
  soil_carbon:          STEP_SOIL_DATA,
  renewable_energy:     STEP_ENERGY_DATA,
  methane_capture:      STEP_METHANE_DATA,
  other:                STEP_CUSTOM_DATA,
};

export function getFormSteps(projectType) {
  const step3 = TYPE_TO_STEP3[projectType] || STEP_ECOLOGICAL_DATA;
  return [STEP_BASIC_INFO, STEP_LOCATION, step3, STEP_METHODOLOGY, STEP_OWNER_LEGAL];
}

export function getFormStepsNumbered(projectType) {
  return getFormSteps(projectType).map((s, i) => ({ ...s, step: i + 1 }));
}

// ─── Initial form state ───────────────────────────────────────────────────────

export function getInitialFormData() {
  const allSteps = [
    STEP_BASIC_INFO, STEP_LOCATION,
    STEP_ECOLOGICAL_DATA, STEP_ENERGY_DATA, STEP_METHANE_DATA, STEP_SOIL_DATA, STEP_CUSTOM_DATA,
    STEP_METHODOLOGY, STEP_OWNER_LEGAL,
  ];
  const data = {};
  for (const step of allSteps) {
    for (const field of step.fields) {
      if (field.type === 'checkbox') data[field.name] = false;
      else if (field.type === 'file') data[field.name] = null;
      else data[field.name] = '';
    }
  }
  return data;
}

// ─── Validation helpers ───────────────────────────────────────────────────────

export function validateStep(stepConfig, formData) {
  const errors = [];

  for (const field of stepConfig.fields) {
    const value = formData[field.name];

    if (field.required && field.type !== 'file') {
      if (value === '' || value === null || value === undefined) {
        errors.push(`"${field.label}" is required.`);
        continue;
      }
    }

    if (field.type === 'number' && value !== '' && value !== null && value !== undefined) {
      const num = Number(value);
      if (isNaN(num)) {
        errors.push(`"${field.label}" must be a valid number.`);
      } else {
        if (field.min !== undefined && num < field.min) {
          errors.push(`"${field.label}" must be at least ${field.min}.`);
        }
        if (field.max !== undefined && num > field.max) {
          errors.push(`"${field.label}" must be at most ${field.max}.`);
        }
      }
    }
  }

  return errors;
}

export function separateFormData(projectType, formData) {
  const step3 = TYPE_TO_STEP3[projectType] || STEP_ECOLOGICAL_DATA;
  const typeSpecificFieldNames = new Set(step3.fields.map((f) => f.name));

  // Map form field names → DB column names for KYC document storage paths
  const DOC_FIELD_TO_DB = {
    aadhaar_doc: 'aadhaar_doc_path',
    land_deed: 'land_deed_path',
    live_verification_photo: 'live_verification_photo_path',
  };

  const flatData = {};
  const methodologySpecificData = {};

  for (const [key, value] of Object.entries(formData)) {
    if (value === '' || value === null || value === undefined) continue;

    // Map document fields to their DB column names
    if (DOC_FIELD_TO_DB[key]) {
      flatData[DOC_FIELD_TO_DB[key]] = value;
      continue;
    }

    if (typeSpecificFieldNames.has(key)) {
      methodologySpecificData[key] = value;
    } else {
      flatData[key] = value;
    }
  }

  if (Object.keys(methodologySpecificData).length > 0) {
    flatData.methodology_specific_data = methodologySpecificData;
  }

  return flatData;
}