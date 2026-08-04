const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {generalLimiter} = require("../middleware/rateLimiter")
const app = express();

// --- Global middleware ---
app.use(cors());               // Allow the React frontend (different port) to call this API
app.use(express.json());       // Parse incoming JSON request bodies

// --- Health check (useful to confirm the server is alive) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Carbon Credit API is running' });
});


// --- Routes ---
app.use(generalLimiter);

app.use('/api/v1/auth', require('../routes/v1/shared/authRoutes'));
app.use('/api/v1/admin', require('../routes/v1/adminRoutes'));
app.use('/api/v1/agent', require('../routes/v1/agentRoutes'));
app.use('/api/v1/projects', require('../routes/v1/projectRoutes'));
app.use('/api/v1/project-posts', require('../routes/v1/projectPostRoutes'));
app.use('/api/v1/verification', require('../routes/v1/verificationRoutes'));
app.use('/api/v1/profile', require('../routes/v1/profileRoutes'));
app.use('/api/v1/wallet', require('../routes/v1/walletRoutes'));
app.use('/api/v1/role', require('../routes/v1/roleRoutes'));
app.use('/api/v1/dashboard', require('../routes/v1/dashboardRoutes'));
app.use('/api/v1/sales', require('../routes/v1/salesRoutes'));
app.use('/api/v1/buyer', require('../routes/v1/buyerRoutes'));
app.use('/v1/share', require('../routes/v1/shared/ogRoutes'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler (catches anything passed to next(err)) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
