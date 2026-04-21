const express = require("express");
const {
  submitResponse,
  getResponsesByForm,
  getMyResponses,
  getSubmittedFormIds,
  getAnalytics,
  exportResponsesCSV,
} = require("../controllers/responseController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Student routes
router.post("/", protect, submitResponse);
router.get("/my", protect, getMyResponses);
router.get("/submitted-forms", protect, getSubmittedFormIds);

// Admin routes
router.get("/analytics", ...adminOnly, getAnalytics);
router.get("/export/:formId", ...adminOnly, exportResponsesCSV);
router.get("/form/:formId", ...adminOnly, getResponsesByForm);

module.exports = router;
