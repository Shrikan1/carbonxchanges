const { pool, query } = require('../config/db');

async function createPost(projectId, data) {
  const result = await query(
    `INSERT INTO project_posts (project_id, title, description, story, how_it_works, images, videos)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      projectId,
      data.title,
      data.description || null,
      data.story || null,
      data.how_it_works || null,
      data.images || [],
      data.videos || [],
    ]
  );
  return result.rows[0];
}


async function findPostById(postId) {
  const result = await query(
    `SELECT pp.*,
            p.title        AS project_title,
            p.project_type,
            u.name         AS seller_name,
            pd.latitude,
            pd.longitude,
            pd.country,
            pd.state_region
     FROM project_posts pp
     JOIN projects p      ON p.id  = pp.project_id
     JOIN users u         ON u.id  = p.seller_id
     LEFT JOIN project_details pd ON pd.project_id = pp.project_id
     WHERE pp.id = $1`,
    [postId]
  );
  return result.rows[0] || null;
}


async function updatePost(postId, data) {
  const allowedFields = ['title', 'description', 'story', 'how_it_works', 'images', 'videos'];
  const fields = allowedFields.filter((f) => data[f] !== undefined);

  if (fields.length === 0) return findPostById(postId);

  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = fields.map((f) => data[f]);

  await query(
    `UPDATE project_posts SET ${setClause}, updated_at = NOW() WHERE id = $1`,
    [postId, ...values]
  );
  return findPostById(postId);
}

async function deletePost(postId) {
  await query('DELETE FROM project_posts WHERE id = $1', [postId]); // cascades updates + likes
}

// Public showcase listing — all posts for a project, most recent first
async function findPostsByProject(projectId) {
  const result = await query(
    `SELECT pp.*,
            p.title        AS project_title,
            p.project_type,
            u.name         AS seller_name,
            pd.latitude,
            pd.longitude,
            pd.country,
            pd.state_region
     FROM project_posts pp
     JOIN projects p      ON p.id  = pp.project_id
     JOIN users u         ON u.id  = p.seller_id
     LEFT JOIN project_details pd ON pd.project_id = pp.project_id
     WHERE pp.project_id = $1
     ORDER BY pp.created_at DESC`,
    [projectId]
  );
  return result.rows;
}

// Global feed — all posts across all projects, most recent first
async function findAllPosts() {
  const result = await query(
    `SELECT pp.*,
            p.title        AS project_title,
            p.project_type,
            u.name         AS seller_name,
            pd.latitude,
            pd.longitude,
            pd.country,
            pd.state_region
     FROM project_posts pp
     JOIN projects p      ON p.id  = pp.project_id
     JOIN users u         ON u.id  = p.seller_id
     LEFT JOIN project_details pd ON pd.project_id = pp.project_id
     ORDER BY pp.created_at DESC`
  );
  return result.rows;
}

// image_url is now a Supabase public URL (uploaded via /api/upload/media)
async function addProgressUpdate(postId, updateText, imageUrl) {
  const result = await query(
    `INSERT INTO project_post_updates (post_id, update_text, image_url)
     VALUES ($1, $2, $3) RETURNING *`,
    [postId, updateText, imageUrl || null]
  );
  return result.rows[0];
}

async function findUpdatesByPost(postId) {
  const result = await query(
    `SELECT * FROM project_post_updates WHERE post_id = $1 ORDER BY created_at DESC`,
    [postId]
  );
  return result.rows;
}

// Toggles a like: if the user already liked this post, remove the like and
// decrement; otherwise add the like and increment. Wrapped in a transaction
// so the likes_count counter can never drift out of sync with the actual rows.
async function toggleLike(postId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query(
      'SELECT id FROM project_post_likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    let liked;
    if (existing.rows.length > 0) {
      await client.query('DELETE FROM project_post_likes WHERE id = $1', [existing.rows[0].id]);
      await client.query('UPDATE project_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1', [postId]);
      liked = false;
    } else {
      await client.query('INSERT INTO project_post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
      await client.query('UPDATE project_posts SET likes_count = likes_count + 1 WHERE id = $1', [postId]);
      liked = true;
    }

    const updatedPost = await client.query('SELECT likes_count FROM project_posts WHERE id = $1', [postId]);
    await client.query('COMMIT');
    return { liked, likes_count: updatedPost.rows[0].likes_count };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function incrementShareCount(postId) {
  const result = await query(
    `UPDATE project_posts SET shares_count = shares_count + 1 WHERE id = $1 RETURNING shares_count`,
    [postId]
  );
  return result.rows[0];
}

module.exports = {
  createPost,
  findPostById,
  updatePost,
  deletePost,
  findPostsByProject,
  findAllPosts,
  addProgressUpdate,
  findUpdatesByPost,
  toggleLike,
  incrementShareCount,
};