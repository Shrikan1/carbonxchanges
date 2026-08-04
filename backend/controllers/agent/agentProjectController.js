const Project = require('../../models/Project');
const Paginate = require('../../utils/paginate')
// GET /api/agent/projects?status=assigned
// Defaults to 'assigned' (active queue needing action). Pass ?status=all
// (or any other value) to see the agent's full history instead.
async function getAssignedProjects(req, res) {
  try {
    const { page, limit, offset } = Paginate.getPagination(req.query);

    const statusFilter =
      req.query.status === "all"
        ? null
        : (req.query.status || "assigned");

    const { rows, total } = await Project.findProjectsByAgent(
      req.user.id,
      {
        status: statusFilter,
        limit,
        offset,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Assigned projects fetched successfully",
      ...Paginate.paginatedResponse(rows, total, page, limit),
    });

  } catch (err) {
    console.error("Get assigned projects error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch assigned projects",
    });
  }
}

// GET /api/agent/projects/:id — full detail, only if THIS agent is assigned to it
async function getAssignedProjectDetails(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    res.json({ project });
  } catch (err) {
    console.error('Get assigned project details error:', err);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
}

// GET /api/agent/projects/due-for-completion
async function getDueForCompletion(req, res) {
  try {
    const projects = await Project.findDueForCompletion(req.user.id);
    res.json({ projects });
  } catch (err) {
    console.error('Get due-for-completion projects error:', err);
    res.status(500).json({ error: 'Failed to fetch due-for-completion projects' });
  }
}

module.exports = { getAssignedProjects, getAssignedProjectDetails, getDueForCompletion };