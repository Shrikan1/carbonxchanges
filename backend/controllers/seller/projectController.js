const Project = require('../../models/Project');
const { getPagination, paginatedResponse } = require('../../utils/paginate')

const REQUIRED_ON_CREATE = ['title', 'project_type', 'project_scale'];

const REQUIRED_ON_SUBMIT = [
  'title', 'project_type', 'project_scale',
  'country', 'total_project_area_hectares', 'project_start_date', 'duration_years',
  'methodology_applied', 'total_co2_claimed',
  'owner_full_name', 'owner_id_type', 'owner_id_number', 'land_ownership_type',
];

// POST /api/projects
async function createProject(req, res) {
  try {
    const missing = REQUIRED_ON_CREATE.filter((f) => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
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




module.exports = { createProject, submitProjectForReview, getProjectById, getMyProjects,getAllProject ,deleteProject};






