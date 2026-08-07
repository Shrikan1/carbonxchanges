const express = require("express");
const router = express.Router;

const postController = require("../../../controllers/seller/projectPostController");


const { requireAuth } = require('../../../middleware/auth');
const { ensureSeller } = require('../../../middleware/capabilityGate');


// Public read — no login required to view a project's showcase
router.get('/project/:projectId', postController.getProjectPosts);
 
router.use(requireAuth);

router.post('/', ensureSeller, postController.createProjectPost);
router.put('/:id', ensureSeller, postController.updateProjectPost);
router.delete('/:id', ensureSeller, postController.deleteProjectPost);
 
// Like/share: any authenticated user, not seller-only
router.post('/:id/like', postController.likeProjectPost);
router.post('/:id/share', postController.shareProjectPost);
 
module.exports = router;