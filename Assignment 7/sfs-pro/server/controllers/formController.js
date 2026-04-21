const { validationResult } = require("express-validator");
const FeedbackForm = require("../models/FeedbackForm");
const FeedbackResponse = require("../models/FeedbackResponse");

// @POST /api/forms  (admin)
const createForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, questions } = req.body;

    const form = await FeedbackForm.create({
      title,
      description,
      questions,
      createdBy: req.user._id,
    });

    await form.populate("createdBy", "name email");

    res.status(201).json({ success: true, message: "Form created successfully!", form });
  } catch (error) {
    next(error);
  }
};

// @GET /api/forms  (all authenticated users)
const getForms = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { isActive: true };
    const forms = await FeedbackForm.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: forms.length, forms });
  } catch (error) {
    next(error);
  }
};

// @GET /api/forms/:id
const getFormById = async (req, res, next) => {
  try {
    const form = await FeedbackForm.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    res.json({ success: true, form });
  } catch (error) {
    next(error);
  }
};

// @PUT /api/forms/:id  (admin)
const updateForm = async (req, res, next) => {
  try {
    const form = await FeedbackForm.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    res.json({ success: true, message: "Form updated successfully!", form });
  } catch (error) {
    next(error);
  }
};

// @DELETE /api/forms/:id  (admin)
const deleteForm = async (req, res, next) => {
  try {
    const form = await FeedbackForm.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found." });
    }

    // Also remove all responses for this form
    await FeedbackResponse.deleteMany({ formId: req.params.id });

    res.json({ success: true, message: "Form and all its responses deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { createForm, getForms, getFormById, updateForm, deleteForm };
