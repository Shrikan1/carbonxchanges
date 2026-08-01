const Project = require('../models/Project');
const ProjectPost = require('../models/ProjectPost');

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function getProjectOgPage(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const posts = await ProjectPost.findPostsByProject(req.params.id);
    const post = posts[0] || {};
    const title = post.title || project.title || 'CarbonXChanges Project';
    const description = post.description || project.project_summary || 'View this carbon project';
    const image = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : '';
    const canonicalUrl = `${req.protocol}://${req.get('host')}/share/projects/${project.id}`;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ''}
  <title>${escapeHtml(title)}</title>
</head>
<body>
  <p>${escapeHtml(description)}</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Get project OG page error:', err);
    res.status(500).send('Failed to load preview');
  }
}

module.exports = { getProjectOgPage };