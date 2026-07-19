const { query } = require('../config/db');
const Credit = require('./Credit');
const Sales = require('./Sales');
const Wallet = require('./Wallet');
const Notification = require('./Notification');
const Verification = require('./Verification');

async function getProjectCounts(sellerId) {
  const result = await query(
    `SELECT status, COUNT(*) AS count
     FROM projects
     WHERE seller_id = $1
     GROUP BY status`,
    [sellerId]
  );

  // Turn [{status: 'pending', count: '3'}, ...] into a flat, predictable shape
  // so the frontend doesn't have to search an array for each status.
  const counts = { total: 0, pending: 0, approved: 0, draft: 0, assigned: 0, verified: 0, rejected: 0, minted: 0 };
  for (const row of result.rows) {
    counts[row.status] = Number(row.count);
    counts.total += Number(row.count);
  }
  return counts;
}

async function getDashboardSummary(sellerId) {
  const [projectCounts, creditBalance, revenue, wallet, notifications] = await Promise.all([
    getProjectCounts(sellerId),
    Credit.calculateSellerBalance(sellerId),
    Sales.calculateRevenue(sellerId),
    Wallet.findWallet(sellerId),
    Notification.findRecentByUser(sellerId, 10),
  ]);

  return {
    total_projects: projectCounts.total,
    pending_projects: projectCounts.pending,
    approved_projects: projectCounts.approved,
    credits_issued: creditBalance.total_minted,
    credits_sold: creditBalance.total_sold,
    revenue: revenue.total_revenue,
    wallet: {
      address: wallet?.wallet_address || null,
      connected: !!wallet?.wallet_address,
      // Note: actual MATIC/token balance is NOT computed here — it's read
      // live from the chain by the frontend via ethers.js once connected.
    },
    recent_notifications: notifications,
  };
}

async function getAgentProjectCounts(agentId) {
  const result = await query(
    `SELECT status, COUNT(*) AS count FROM projects WHERE agent_id = $1 GROUP BY status`,
    [agentId]
  );

  const counts = { total: 0, assigned: 0, verified: 0, approved: 0, rejected: 0, minted: 0 };
  for (const row of result.rows) {
    counts[row.status] = Number(row.count);
    counts.total += Number(row.count);
  }
  return counts;
}

async function getAgentDashboardSummary(agentId) {
  const [projectCounts, recentReports, notifications] = await Promise.all([
    getAgentProjectCounts(agentId),
    Verification.findReportsByAgent(agentId),
    Notification.findRecentByUser(agentId, 10),
  ]);

  return {
    pending_verifications: projectCounts.assigned,
    completed_verifications:
      projectCounts.verified + projectCounts.approved + projectCounts.rejected + projectCounts.minted,
    total_assigned: projectCounts.total,
    recent_reports: recentReports.slice(0, 5),
    recent_notifications: notifications,
  };
}

async function getPlatformUserCounts() {
  const result = await query(
    `SELECT
       COUNT(*) AS total_users,
       COUNT(*) FILTER (WHERE is_seller) AS total_sellers,
       COUNT(*) FILTER (WHERE is_buyer) AS total_buyers,
       COUNT(*) FILTER (WHERE role = 'agent') AS total_agents,
       COUNT(*) FILTER (WHERE role = 'admin') AS total_admins
     FROM users`
  );
  const row = result.rows[0];
  return {
    total_users: Number(row.total_users),
    total_sellers: Number(row.total_sellers),
    total_buyers: Number(row.total_buyers),
    total_agents: Number(row.total_agents),
    total_admins: Number(row.total_admins),
  };
}

async function getPlatformProjectCounts() {
  const result = await query(`SELECT status, COUNT(*) AS count FROM projects GROUP BY status`);

  const counts = {
    total: 0, draft: 0, pending: 0, assigned: 0, in_progress: 0,
    verified: 0, approved: 0, rejected: 0, minted: 0,
  };
  for (const row of result.rows) {
    counts[row.status] = Number(row.count);
    counts.total += Number(row.count);
  }
  return counts;
}

async function getPlatformCreditStats() {
  const mintedResult = await query(`SELECT COALESCE(SUM(token_amount), 0) AS total_minted FROM credit_batches`);
  const revenueResult = await query(
    `SELECT COALESCE(SUM(total_price), 0) AS total_revenue, COALESCE(SUM(amount), 0) AS total_credits_sold
     FROM transactions WHERE type = 'purchase'`
  );
  return {
    total_credits_minted: Number(mintedResult.rows[0].total_minted),
    total_platform_revenue: Number(revenueResult.rows[0].total_revenue),
    total_credits_sold: Number(revenueResult.rows[0].total_credits_sold),
  };
}

// Projects sitting in_progress past their own declared completion date —
// i.e. due for an agent's completion visit right now
async function getOverdueCompletionsCount() {
  const result = await query(
    `SELECT COUNT(*) AS count FROM projects
     WHERE status = 'in_progress' AND expected_completion_date <= CURRENT_DATE`
  );
  return Number(result.rows[0].count);
}

async function getAdminDashboardSummary() {
  const [userCounts, projectCounts, creditStats, overdueCompletionsCount] = await Promise.all([
    getPlatformUserCounts(),
    getPlatformProjectCounts(),
    getPlatformCreditStats(),
    getOverdueCompletionsCount(),
  ]);

  return {
    users: userCounts,
    projects: projectCounts,
    credits: creditStats,
    pending_review_count: projectCounts.pending,
    overdue_completions_count: overdueCompletionsCount,
  };
}

module.exports = { getDashboardSummary, getAgentDashboardSummary, getAdminDashboardSummary };