const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {generalLimiter} = require("../middleware/rateLimiter")
const app = express();


// --- Global middleware ---
app.use(cors({ origin: true, credentials: true })); // credentials:true allows cookies cross-origin
app.use(express.json());       // Parse incoming JSON request bodies
app.use(cookieParser());       // Parse httpOnly cookies (used for refresh token)


// --- Health check (useful to confirm the server is alive) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Carbon Credit API is running' });
});


// --- Routes ---
app.use(generalLimiter);

// Serve static files (used for fallback local media uploads)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

app.use('/api/v1/auth', require('../routes/v1/shared/authRoutes'));
app.use('/api/upload', require('../routes/v1/shared/uploadRoutes'));
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
app.use('/api/v1/notifications', require('../routes/v1/shared/notificationRoutes'));
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
