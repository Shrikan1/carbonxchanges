const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const projectController = require('../../controllers/seller/projectController');

router.use(requireAuth);

router.get('/mine', projectController.getMyProjects);
router.get('/all', projectController.getAllProject);
router.post('/', projectController.createProject);
router.put('/:id/submit', projectController.submitProjectForReview);
router.get('/:id', projectController.getProjectById);
router.delete('/:id', projectController.deleteProject);

module.exports = router;