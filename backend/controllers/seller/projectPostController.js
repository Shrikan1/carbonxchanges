const ProjectPost = require('../../models/ProjectPost');
const Project = require('../../models/Project');

// POST /api/project-posts   body: { project_id, title, description, story, how_it_works, images, videos }
async function createProjectPost(req, res) {
  try {
    const { project_id, title } = req.body;
    if (!project_id || !title) {
      return res.status(400).json({ error: 'project_id and title are required' });
    }

    const project = await Project.findProjectById(project_id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this project' });
    }

    const post = await ProjectPost.createPost(project_id, req.body);
    res.status(201).json({ message: 'Project post created', post });
  } catch (err) {
    console.error('Create project post error:', err);
    res.status(500).json({ error: 'Failed to create project post' });
  }
}

// PUT /api/project-posts/:id
async function updateProjectPost(req, res) {
  try {
    const post = await ProjectPost.findPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this post' });
    }

    const updated = await ProjectPost.updatePost(req.params.id, req.body);
    res.json({ message: 'Post updated', post: updated });
  } catch (err) {
    console.error('Update project post error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
}

// DELETE /api/project-posts/:id
async function deleteProjectPost(req, res) {
  try {
    const post = await ProjectPost.findPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this post' });
    }

    await ProjectPost.deletePost(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete project post error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

// GET /api/project-posts/project/:projectId  — public, no ownership check
async function getProjectPosts(req, res) {
  try {
    const posts = await ProjectPost.findPostsByProject(req.params.projectId);
    // Attach progress updates for each post so the showcase page has everything in one call
    const postsWithUpdates = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        updates: await ProjectPost.findUpdatesByPost(post.id),
      }))
    );
    res.json({ posts: postsWithUpdates });
  } catch (err) {
    console.error('Get project posts error:', err);
    res.status(500).json({ error: 'Failed to fetch project posts' });
  }
}

// GET /api/project-posts/all — public, get all global posts
async function getAllProjectPosts(req, res) {
  try {
    const posts = await ProjectPost.findAllPosts();
    res.json({ posts });
  } catch (err) {
    console.error('Get all project posts error:', err);
    res.status(500).json({ error: 'Failed to fetch global posts' });
  }
}

// POST /api/project-posts/:id/like  — any authenticated user (typically a buyer)
async function likeProjectPost(req, res) {
  try {
    const post = await ProjectPost.findPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const result = await ProjectPost.toggleLike(req.params.id, req.user.id);
    res.json({ message: result.liked ? 'Post liked' : 'Like removed', ...result });
  } catch (err) {
    console.error('Like project post error:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
}

// POST /api/project-posts/:id/share  — just increments a counter, no auth strictly required
async function shareProjectPost(req, res) {
  try {
    const post = await ProjectPost.findPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const result = await ProjectPost.incrementShareCount(req.params.id);
    res.json({ message: 'Share recorded', shares_count: result.shares_count });
  } catch (err) {
    console.error('Share project post error:', err);
    res.status(500).json({ error: 'Failed to record share' });
  }
}

module.exports = {
  createProjectPost,
  updateProjectPost,
  deleteProjectPost,
  getProjectPosts,
  getAllProjectPosts,
  likeProjectPost,
  shareProjectPost,
};