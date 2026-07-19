const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./models/User');
const { sendAgentCredentialsEmail } = require('./services/emailService');
const Project = require("../models/Project")
const User = require("../models/User")

function generateTempPassword() {
  return crypto.randomBytes(4).toString('hex');
}

async function createAgent(req, res) {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const agent = await User.createAgent({
      name,
      email,
      passwordHash,
      createdByAdminId: req.user.id, // set by requireAuth middleware
    });

    await sendAgentCredentialsEmail(email, name, tempPassword);

    res.status(201).json({
      message: 'Agent created and credentials emailed successfully',
      agent,
    });
  } catch (err) {
    console.error('Create agent error:', err);
    res.status(500).json({ error: 'Failed to create agent account' });
  }
}


async function getAllAgent(req, res) {
    try {
        const agents = await User.findAllAgents();

        if (agents.length === 0) {
            return res.status(404).json({
                message: "No agents found"
            });
        }

        return res.status(200).json({
            message: "Agents fetched successfully",
            agents
        });

    } catch (error) {
        console.error("Get All Agents Error:", error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}



async function deleteProjectByAdmin(req , res){
    try{
        const project = await Project.findProjectById(req.params.id)
        if(!project){
            return res.status(404).json({
                message:"No Project Found",
            })
        }
        if(project.status != "minted"){
           const deletedProject = await Project.deleteProject(req.params.id)
           return res.status(200).json({
            success: true,
            message:"Project Deleted Successfully",
            deletedProject
           })
        }

        
      
           return res.status(404).json({
            success: true,
            message:"Can Not Delete Project",
            })
        
    }catch(err){
        console.error("Get all projects error:", err);
        res.status(500).json({ 
            success:false,
            error: "Failed to fetch projects" 
        });
    }
}

async function getAgentWorkload(req, res) {
  try {
    const agent = await User.findAgentById(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const projects = await Project.findProjectsByAgent(req.params.id);
    res.json({ agent, projects });
  } catch (err) {
    console.error('Get agent workload error:', err);
    res.status(500).json({ error: 'Failed to fetch agent workload' });
  }
}

module.exports = { createAgent ,getAllAgent,
  deleteProjectByAdmin , getAgentWorkload
 };


