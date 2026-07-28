const express = require("express");
const router = express.Router();

const DashboardSummary = require("../../controllers/seller/dashboardController");
const { requireAuth } = require("../../middleware/auth");
const { ensureSeller } = require("../../middleware/capabilityGate");

// Apply authentication to all routes
router.use(requireAuth);

// Seller Dashboard
router.get(
  "/dashboard",
  ensureSeller,
  DashboardSummary.getDashboardSummary
);

module.exports = router;