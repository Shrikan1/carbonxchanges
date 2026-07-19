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

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/share', require('./routes/ogRoutes'));


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Global error handler (catches anything passed to next(err)) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;