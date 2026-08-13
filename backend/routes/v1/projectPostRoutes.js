const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const projectPostController = require('../../controllers/seller/projectPostController');

router.use(requireAuth);

router.post('/', projectPostController.createProjectPost);
router.get('/all', projectPostController.getAllProjectPosts);
router.get('/project/:projectId', projectPostController.getProjectPosts);
router.put('/:id', projectPostController.updateProjectPost);
router.delete('/:id', projectPostController.deleteProjectPost);
router.post('/:id/like', projectPostController.likeProjectPost);
router.post('/:id/share', projectPostController.shareProjectPost);

module.exports = router;