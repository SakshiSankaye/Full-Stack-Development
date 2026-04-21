const express = require("express");
const { body } = require("express-validator");
const {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
} = require("../controllers/formController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

const formValidation = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("questions").isArray({ min: 1 }).withMessage("At least one question is required"),
  body("questions.*.text").notEmpty().withMessage("Each question must have text"),
  body("questions.*.type")
    .optional()
    .isIn(["rating", "text", "multiple_choice"])
    .withMessage("Invalid question type"),
];

router.post("/", ...adminOnly, formValidation, createForm);
router.get("/", protect, getForms);
router.get("/:id", protect, getFormById);
router.put("/:id", ...adminOnly, updateForm);
router.delete("/:id", ...adminOnly, deleteForm);

module.exports = router;
