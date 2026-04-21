const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ["rating", "text", "multiple_choice"],
    default: "rating",
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // can be number (rating) or string (text)
    required: true,
  },
});

const feedbackResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedbackForm",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate submissions
feedbackResponseSchema.index({ formId: 1, studentId: 1 }, { unique: true });

// Calculate average rating before saving
feedbackResponseSchema.pre("save", function (next) {
  const ratingAnswers = this.answers.filter(
    (a) => a.questionType === "rating" && typeof a.value === "number"
  );
  if (ratingAnswers.length > 0) {
    const sum = ratingAnswers.reduce((acc, a) => acc + a.value, 0);
    this.averageRating = parseFloat((sum / ratingAnswers.length).toFixed(2));
  }
  next();
});

module.exports = mongoose.model("FeedbackResponse", feedbackResponseSchema);
