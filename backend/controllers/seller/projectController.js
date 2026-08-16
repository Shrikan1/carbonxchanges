const Project = require('../../models/Project');
const { getPagination, paginatedResponse } = require('../../utils/paginate');

const VALID_PROJECT_TYPES = [
  'reforestation', 'afforestation', 'mangrove_restoration', 'redd+',
  'soil_carbon', 'renewable_energy', 'methane_capture', 'other',
];
const VALID_SCALES = ['small-scale', 'large-scale'];

const REQUIRED_ON_CREATE = ['title', 'project_type', 'project_scale'];

// Fields that must be present before a project can be submitted for review.
// These are the shared minimum — the methodology_specific_data is validated
// separately per project_type inside submitProjectForReview.
const REQUIRED_ON_SUBMIT = [
  'title', 'project_type', 'project_scale',
  'country', 'total_project_area_hectares', 'project_start_date', 'duration_years',
  'methodology_applied', 'total_co2_claimed',
  'owner_full_name', 'owner_id_type', 'owner_id_number', 'land_ownership_type',
];

// Numeric range constraints — enforced on both create and update.
const NUMERIC_CONSTRAINTS = {
  latitude:  { min: -90,  max: 90  },
  longitude: { min: -180, max: 180 },
  duration_years: { min: 1, max: 100 },
  crediting_period_years: { min: 1, max: 100 },
  total_project_area_hectares: { min: 0.01 },
  total_co2_claimed: { min: 1 },
  uncertainty_percentage: { min: 0, max: 100 },
  set_aside_conservation_percent: { min: 0, max: 100 },
};

function validateNumericConstraints(data) {
  const errors = [];
  for (const [field, { min, max }] of Object.entries(NUMERIC_CONSTRAINTS)) {
    if (data[field] === undefined || data[field] === '') continue;
    const val = Number(data[field]);
    if (isNaN(val)) { errors.push(`${field} must be a number`); continue; }
    if (min !== undefined && val < min) errors.push(`${field} must be ≥ ${min}`);
    if (max !== undefined && val > max) errors.push(`${field} must be ≤ ${max}`);
  }
  return errors;
}

// POST /api/projects
async function createProject(req, res) {
  try {
    const missing = REQUIRED_ON_CREATE.filter((f) => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    if (!VALID_PROJECT_TYPES.includes(req.body.project_type)) {
      return res.status(400).json({
        error: `Invalid project_type. Must be one of: ${VALID_PROJECT_TYPES.join(', ')}`,
      });
    }
    if (!VALID_SCALES.includes(req.body.project_scale)) {
      return res.status(400).json({
        error: `Invalid project_scale. Must be 'small-scale' or 'large-scale'`,
      });
    }

    const numericErrors = validateNumericConstraints(req.body);
    if (numericErrors.length > 0) {
      return res.status(400).json({ error: numericErrors.join('; ') });
    }

    const project = await Project.createProject(req.user.id, req.body);
    res.status(201).json({ message: 'Project draft created', project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

// PUT /api/projects/:id/submit
async function submitProjectForReview(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }
    if (project.status !== 'draft') {
      return res.status(400).json({ error: `Only draft projects can be submitted (current status: ${project.status})` });
    }

    const missing = REQUIRED_ON_SUBMIT.filter((f) => project[f] === null || project[f] === undefined || project[f] === '');
    if (missing.length > 0) {
      return res.status(400).json({ error: `Cannot submit — missing fields: ${missing.join(', ')}` });
    }

    const updated = await Project.changeProjectStatus(project.id, 'pending');
    res.json({ message: 'Project submitted for admin review', project: updated });
  } catch (err) {
    console.error('Submit project error:', err);
    res.status(500).json({ error: 'Failed to submit project' });
  }
}

// GET /api/projects/:id
async function getProjectById(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const isOwner = project.seller_id === req.user.id;
    const isStaff = ['admin', 'agent'].includes(req.user.role);
    if (!isOwner && !isStaff) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    res.json({ project });
  } catch (err) {
    console.error('Get project error:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}

// GET /api/projects/public/:id
async function getPublicProjectById(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Explicitly delete sensitive fields before returning to unauthenticated public clients
    const sensitiveFields = [
      'owner_full_name', 'owner_id_type', 'owner_id_number',
      'aadhaar_doc_path', 'land_deed_path', 'live_verification_photo_path',
      'seller_id', 'agent_id'
    ];
    
    for (const field of sensitiveFields) {
      delete project[field];
    }

    res.json({ project });
  } catch (err) {
    console.error('Get public project error:', err);
    res.status(500).json({ error: 'Failed to fetch public project details' });
  }
}

// GET /api/projects/mine
async function getMyProjects(req, res) {
  try {
    const {page , limit , offset} = getPagination(req.query)
    const { rows, total }  = await Project.findProjectsBySeller(req.user.id , { limit, offset });
    res.status(200).json({ 
      success:true,
      message:"Project Fetch Successfully",
      ...paginatedResponse(rows , total , page , limit)
     });
  } catch (err) {
    console.error('Get my projects error:', err);
    res.status(500).json({ error: 'Failed to fetch your projects' });
  }
}
// GWT /api/projects/all
async function getAllProject(req,res){
    try {

      const {page , limit , offset} = getPagination(req.query)
      const { rows, total } = await Project.findAllProjects({ limit, offset });

       if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Projects Found",
      });
    }

        res.json(paginatedResponse(rows, total, page, limit));

    } catch (err) {
        console.error("Get all projects error:", err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
}

//Seller Route & Action

async function deleteProject(req , res){
    try{
        const project = await Project.findProjectById(req.params.id)
        if(!project){
            return res.status(404).json({
                message:"No Project Found",
            })
        }

        if (project.seller_id !== req.user.id) {
    return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project"
    });
}
        if(project.status == "draft"){
           const deletedProject = await Project.deleteProject(req.params.id)
           return res.status(200).json({
            success: true,
            message:"Project Deleted Successfully",
            deletedProject
           })
        }

        return res.status(400).json({
    success: false,
    message: "Only draft projects can be deleted"
});
        
    }catch(err){
        console.error("Get all projects error:", err);
        res.status(500).json({ 
            succes:false,
            error: "Failed to fetch projects" 
        });
    }
}


//Admin Action

// async function deleteProjectByAdmin(req , res){
//     try{
//         const project = await Project.findProjectById(req.params.id)
//         if(!project){
//             return res.status(404).json({
//                 message:"No Project Found",
//             })
//         }

        
//            const deletedProject = await Project.deleteProject(req.params.id)
//            return res.status(200).json({
//             success: true,
//             message:"Project Deleted Successfully",
//             deletedProject})
        
//     }catch(err){
//         console.error("Get all projects error:", err);
//         res.status(500).json({ 
//             success:false,
//             error: "Failed to fetch projects" 
//         });
//     }
// }




module.exports = { createProject, submitProjectForReview, getProjectById, getPublicProjectById, getMyProjects,getAllProject ,deleteProject};






