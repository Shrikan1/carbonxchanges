
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Global middleware ---
app.use(cors());               // Allow the React frontend (different port) to call this API
app.use(express.json());       // Parse incoming JSON request bodies

// --- Health check (useful to confirm the server is alive) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Carbon Credit API is running' });
});

// --- Shared routes (used by multiple/any role) ---
app.use('/api/auth', require('../routes/shared/authRoutes'));
app.use('/api/role', require('../routes/shared/roleRoutes'));
app.use('/api/wallet', require('../routes/shared/WalletRoutes'));
app.use('/api/profile', require('../routes/shared/ProfileRoutes'));
app.use('/share', require('../routes/shared/ogRoutes'));

// --- Seller routes ---
app.use('/api/projects', require('../routes/seller/ProjectRoutes'));
app.use('/api/project-posts', require('../routes/seller/ProjectPostRoutes'));
app.use('/api/verification', require('../routes/seller/VerificationRoutes'));
app.use('/api/credits', require('../routes/seller/CreditRoutes'));
app.use('/api/marketplace', require('../routes/seller/MarketplaceRoutes'));
app.use('/api/sales', require('../routes/seller/SalesRoutes'));
app.use('/api/dashboard', require('../routes/seller/DashboardRoutes'));

// --- Admin routes ---
app.use('/api/admin', require('../routes/admin/adminRoutes')); // agent creation/management (/api/admin/agents...)
app.use('/api/admin/projects', require('../routes/admin/adminprojectroutes'));
app.use('/api/admin/mint', require('../routes/admin/mintRoutes'));
app.use('/api/admin/oversight', require('../routes/admin/oversightroutes'));
app.use('/api/admin/dashboard', require('../routes/admin/admindashboardroutes'));
app.use('/api/admin/reversals', require('../routes/admin/reversalroutes'));

// --- Agent routes ---
app.use('/api/agent/projects', require('../routes/agent/Agentprojectroutes'));
app.use('/api/agent/projects', require('../routes/agent/Agentverificationroutes'));
app.use('/api/agent/projects', require('../routes/agent/Agentdocumentroutes'));
app.use('/api/agent/projects', require('../routes/agent/Agentreinspectionroutes'));
app.use('/api/agent/reports', require('../routes/agent/Agentcommunicationroutes'));
app.use('/api/agent/history', require('../routes/agent/Agenthistoryroutes'));
app.use('/api/agent/dashboard', require('../routes/agent/Agentdashboardroutes'));

// --- Buyer routes ---
app.use('/api/buyer/marketplace', require('../routes/buyer/buyerMarketplaceRoutes'));
app.use('/api/buyer/purchase', require('../routes/buyer/buyerPurchaseRoutes'));
app.use('/api/buyer/portfolio', require('../routes/buyer/portfolioRoutes'));
app.use('/api/buyer', require('../routes/buyer/retirementRoutes')); // /retire, /certificates, /certificates/:id/download
app.use('/api/buyer/transactions', require('../routes/buyer/buyerTransactionRoutes'));
app.use('/api/buyer/dashboard', require('../routes/buyer/buyerDashboardRoutes'));

// --- 404 handler (must come after all routes) ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler (catches anything passed to next(err)) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;