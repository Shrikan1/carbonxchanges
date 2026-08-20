const { pool, query } = require('../config/db');

// All project_details columns that come from the registration form.
// Centralized here so insert/update stay in sync and we never trust
// arbitrary keys from req.body directly into SQL.
// Shared fields common to ALL project types.
// Type-specific ecological/energy/methane fields are stored in methodology_specific_data (JSONB).
const DETAIL_FIELDS = [
  'duration_months', 'crediting_period_months', 'project_start_date', 'project_summary',
  'funding_sources', 'publicly_funded',
  'country', 'state_region', 'latitude', 'longitude', 'total_project_area_hectares',
  'eligible_area_hectares', 'set_aside_conservation_percent', 'climate_zone', 'soil_type',
  'hydrology_status', 'land_title_status',
  'technologies_measures_description', 'methodology_applied', 'ghg_sources_included',
  'baseline_scenario', 'additionality_demonstration', 'sdg_targets', 'total_co2_claimed',
  'estimated_vers', 'monitoring_frequency', 'responsible_person',
  'stakeholder_consultation_summary', 'griebance_mechanism',
  // Owner & legal
  'owner_full_name', 'owner_id_type', 'owner_id_number', 'land_ownership_type',
  // KYC document storage paths (private Supabase bucket paths, NOT public URLs)
  'aadhaar_doc_path', 'land_deed_path', 'live_verification_photo_path',
  // Type-specific data stored as JSON (e.g. biomass for forestry, capacity_mw for energy)
  'methodology_specific_data',
];

// Creates the core project row + its details row in a single transaction —
// if either insert fails, both roll back, so we never get an orphaned
// project with no details (or vice versa).
async function createProject(sellerId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const coreResult = await client.query(
      `INSERT INTO projects (seller_id, title, project_type, project_scale, status)
       VALUES ($1, $2, $3, $4, 'draft')
       RETURNING *`,
      [sellerId, data.title, data.project_type, data.project_scale]
    );
    const project = coreResult.rows[0];

    const { columns, values, placeholders } = buildDetailInsert(project.id, data);
    await client.query(
      `INSERT INTO project_details (${columns.join(', ')}) VALUES (${placeholders})`,
      values
    );

    await client.query('COMMIT');
    return findProjectById(project.id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function buildDetailInsert(projectId, data) {
  const columns = ['project_id'];
  const values = [projectId];

  for (const field of DETAIL_FIELDS) {
    if (data[field] !== undefined) {
      columns.push(field);
      // Serialize JSONB field so pg driver stores it correctly
      if (field === 'methodology_specific_data') {
        values.push(
          typeof data[field] === 'string' ? data[field] : JSON.stringify(data[field])
        );
      } else {
        values.push(data[field]);
      }
    }
  }

  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  return { columns, values, placeholders };
}

// Updates only fields that are present in `data`. Only allowed while the
// project is still in 'draft' status — enforced in the controller, not here,
// so this model stays a pure data layer.
async function updateProject(projectId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Core fields (title/type/scale) live on `projects`
    const coreFields = ['title', 'project_type', 'project_scale'];
    const coreUpdates = coreFields.filter((f) => data[f] !== undefined);
    if (coreUpdates.length > 0) {
      const setClause = coreUpdates.map((f, i) => `${f} = $${i + 2}`).join(', ');
      await client.query(
        `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $1`,
        [projectId, ...coreUpdates.map((f) => data[f])]
      );
    }

    // Everything else lives on `project_details`
    const detailUpdates = DETAIL_FIELDS.filter((f) => data[f] !== undefined);
    if (detailUpdates.length > 0) {
      const setClause = detailUpdates.map((f, i) => `${f} = $${i + 2}`).join(', ');
      const detailValues = detailUpdates.map((f) => {
        if (f === 'methodology_specific_data') {
          return typeof data[f] === 'string' ? data[f] : JSON.stringify(data[f]);
        }
        return data[f];
      });
      await client.query(
        `UPDATE project_details SET ${setClause}, updated_at = NOW() WHERE project_id = $1`,
        [projectId, ...detailValues]
      );
    }

    await client.query('COMMIT');
    return findProjectById(projectId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Full project record: core + details joined together + seller details
async function findProjectById(projectId) {
  const result = await query(
    `SELECT p.*, d.*,
            u.name AS seller_name, 
            u.email AS seller_email, 
            u.phone_number AS seller_phone, 
            u.address AS seller_address
     FROM projects p
     LEFT JOIN project_details d ON d.project_id = p.id
     LEFT JOIN users u ON p.seller_id = u.id
     WHERE p.id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

// Lightweight list for dashboards — core fields only, no ~40 detail columns
async function findProjectsBySeller(sellerId, { limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT id, title, project_type, project_scale, status, created_at, updated_at
       FROM projects
       WHERE seller_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset]
    ),
    query(`SELECT COUNT(*) FROM projects WHERE seller_id = $1`, [sellerId]),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

// async function findAllProjects() {
//   const result = await query(
//     `SELECT id, seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at
//      FROM projects
//      ORDER BY created_at DESC`
//   );
//   return result.rows;
// }

async function findAllProjects({ limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT id, seller_id, agent_id, title, project_type, status, created_at
       FROM projects ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    query(`SELECT COUNT(*) FROM projects`),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}


// Only allowed while still a draft — enforced by caller checking status first
async function deleteProject(projectId) {
  await query('DELETE FROM projects WHERE id = $1', [projectId]); // cascades to project_details
}

async function changeProjectStatus(projectId, status) {
  const result = await query(
    `UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, projectId]
  );
  return result.rows[0];
}

// Rejects the project and removes any assigned agent in one step
async function rejectProject(projectId) {
  const result = await query(
    `UPDATE projects SET status = 'rejected', agent_id = NULL, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [projectId]
  );
  return result.rows[0];
}

// Admin review queue — all projects in a given status, with seller name
// attached for display. Core fields only (no ~40 detail columns) to keep
// the queue list fast; full detail is a separate findProjectById call
// when admin opens one specific project.
async function findByStatus(status, { limit = 20, offset = 0 } = {}) {
  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT p.id, p.title, p.project_type, p.project_scale, p.status,
              p.agent_id, p.created_at, u.name AS seller_name, u.email AS seller_email
       FROM projects p
       JOIN users u ON u.id = p.seller_id
       WHERE p.status = $1
       ORDER BY p.created_at ASC LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    ),
    query(`SELECT COUNT(*) FROM projects WHERE status = $1`, [status]),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

// Assigns an agent and moves the project into 'assigned' status in one step —
// a project shouldn't sit as 'pending' with an agent already on it.
async function assignAgent(projectId, agentId) {
  const result = await query(
    `UPDATE projects SET agent_id = $1, status = 'assigned', updated_at = NOW()
     WHERE id = $2 RETURNING *`,
    [agentId, projectId]
  );
  return result.rows[0];
}

// Unassigns the agent and reverts to 'pending' — verification can't
// meaningfully continue with no agent, so the status must roll back too.
async function removeAgent(projectId) {
  const result = await query(
    `UPDATE projects SET agent_id = NULL, status = 'pending', updated_at = NOW()
     WHERE id = $1 RETURNING *`,
    [projectId]
  );
  return result.rows[0];
}

// Per-agent counts across all agents in one query — used for the admin's
// agent management view so it doesn't need N queries for N agents.
async function findAgentWorkloadSummary() {
  const result = await query(
    `SELECT agent_id,
            COUNT(*) FILTER (WHERE status = 'assigned') AS active_count,
            COUNT(*) FILTER (WHERE status IN ('verified', 'approved', 'rejected', 'minted')) AS completed_count,
            COUNT(*) AS total_count
     FROM projects
     WHERE agent_id IS NOT NULL
     GROUP BY agent_id`
  );
  return result.rows;
}

// All projects (any status) currently or previously assigned to one agent —
// used for the agent's own queue (status filter) and admin's workload
// drill-down (no filter). Optional `status` narrows to e.g. just 'assigned'.
async function findProjectsByAgent(agentId, { status = null, limit = 20, offset = 0 } = {}) {
  const filterValues = status ? [agentId, status] : [agentId];
  const limitIdx = filterValues.length + 1;
  const offsetIdx = limitIdx + 1;

  const [dataResult, countResult] = await Promise.all([
    query(
      `SELECT id, title, project_type, status, created_at
       FROM projects
       WHERE agent_id = $1 ${status ? 'AND status = $2' : ''}
       ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      [...filterValues, limit, offset]
    ),
    query(
      `SELECT COUNT(*) FROM projects WHERE agent_id = $1 ${status ? 'AND status = $2' : ''}`,
      filterValues
    ),
  ]);
  return { rows: dataResult.rows, total: parseInt(countResult.rows[0].count) };
}

// Computes expected_completion_date = project_start_date + duration_months,
// reading directly from project_details, and stores it on the core
// projects row for fast querying later. Called once, at submission time
// (both fields are guaranteed present by then — see REQUIRED_ON_SUBMIT).
// This date becomes the earliest a completion verification can happen —
// the agent can't certify a project as "built" before the seller's own
// declared timeline says it should be.
async function setExpectedCompletionDate(projectId, overrideDate = null) {
  if (overrideDate) {
    const result = await query(
      `UPDATE projects SET expected_completion_date = $1 WHERE id = $2 RETURNING *`,
      [overrideDate, projectId]
    );
    return result.rows[0];
  } else {
    const result = await query(
      `UPDATE projects p
       SET expected_completion_date = (pd.project_start_date + (pd.duration_months || ' months')::interval)::date
       FROM project_details pd
       WHERE p.id = pd.project_id AND p.id = $1
       RETURNING p.*`,
      [projectId]
    );
    return result.rows[0];
  }
}

async function updateAgentReviewProgress(projectId, progressJson) {
  const result = await query(
    `UPDATE projects SET agent_review_progress = $1 WHERE id = $2 RETURNING *`,
    [JSON.stringify(progressJson), projectId]
  );
  return result.rows[0];
}

// Projects assigned to an agent whose completion verification is now due
// (status still 'in_progress' AND today >= expected_completion_date) —
// used for the agent's "due for completion check" queue.
async function findDueForCompletion(agentId) {
  const result = await query(
    `SELECT id, title, project_type, status, expected_completion_date, created_at
     FROM projects
     WHERE agent_id = $1 AND status = 'in_progress' AND expected_completion_date <= CURRENT_DATE
     ORDER BY expected_completion_date ASC`,
    [agentId]
  );
  return result.rows;
}

async function updateKycDocStatus(projectId, docType, status, reason = null) {
  const result = await query(
    `UPDATE projects
     SET kyc_docs_status = jsonb_set(
       kyc_docs_status,
       $1::text[],
       $2::jsonb
     )
     WHERE id = $3
     RETURNING *`,
    [[docType], JSON.stringify({ status, reason }), projectId]
  );
  return result.rows[0];
}

async function updateKycDocPath(projectId, docType, path) {
  // Update the path on the project_details or projects table, and reset its kyc_docs_status to pending
  // We need to map docType to the column name
  const colMap = {
    'aadhaar': 'aadhaar_doc_path',
    'land_deed': 'land_deed_path',
    'live_photo': 'live_verification_photo_path'
  };
  const colName = colMap[docType];
  if (!colName) throw new Error('Invalid docType');

  // Updating project_details since these are detail fields
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(
      `UPDATE project_details SET ${colName} = $1 WHERE project_id = $2`,
      [path, projectId]
    );

    const projectResult = await client.query(
      `UPDATE projects
       SET kyc_docs_status = jsonb_set(
         kyc_docs_status,
         $1::text[],
         $2::jsonb
       )
       WHERE id = $3
       RETURNING *`,
      [[docType], JSON.stringify({ status: 'pending', reason: null }), projectId]
    );

    await client.query('COMMIT');
    return findProjectById(projectId); // Return fully joined project
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createProject,
  updateProject,
  findProjectById,
  findProjectsBySeller,
  findAllProjects,
  deleteProject,
  changeProjectStatus,
  rejectProject,
  findByStatus,
  assignAgent,
  removeAgent,
  findAgentWorkloadSummary,
  findProjectsByAgent,
  setExpectedCompletionDate,
  findDueForCompletion,
  updateAgentReviewProgress,
  updateKycDocStatus,
  updateKycDocPath,
  DETAIL_FIELDS,
};