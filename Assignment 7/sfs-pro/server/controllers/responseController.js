const FeedbackResponse = require("../models/FeedbackResponse");
const FeedbackForm = require("../models/FeedbackForm");

// @POST /api/responses  (student)
const submitResponse = async (req, res, next) => {
  try {
    const { formId, answers } = req.body;

    if (!formId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "formId and answers are required." });
    }

    // Check form exists
    const form = await FeedbackForm.findById(formId);
    if (!form || !form.isActive) {
      return res.status(404).json({ message: "Form not found or inactive." });
    }

    // Check for duplicate submission
    const existing = await FeedbackResponse.findOne({
      formId,
      studentId: req.user._id,
    });
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted feedback for this form.",
      });
    }

    // Validate required questions answered
    const requiredQIds = form.questions
      .filter((q) => q.required)
      .map((q) => q._id.toString());

    const answeredQIds = answers.map((a) => a.questionId?.toString());
    const missingRequired = requiredQIds.filter((id) => !answeredQIds.includes(id));

    if (missingRequired.length > 0) {
      return res.status(400).json({
        message: `Please answer all required questions. ${missingRequired.length} required question(s) unanswered.`,
      });
    }

    // Build enriched answers with question text + type
    const enrichedAnswers = answers.map((ans) => {
      const question = form.questions.find(
        (q) => q._id.toString() === ans.questionId?.toString()
      );
      return {
        questionId: ans.questionId,
        questionText: question ? question.text : "Unknown question",
        questionType: question ? question.type : "text",
        value: ans.value,
      };
    });

    const response = await FeedbackResponse.create({
      formId,
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      answers: enrichedAnswers,
    });

    // Increment form response count
    await FeedbackForm.findByIdAndUpdate(formId, { $inc: { responseCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      response,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already submitted feedback for this form.",
      });
    }
    next(error);
  }
};

// @GET /api/responses/form/:formId  (admin)
const getResponsesByForm = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const { search, startDate, endDate, page = 1, limit = 50 } = req.query;

    let filter = { formId };

    // Search by student name
    if (search) {
      filter.studentName = { $regex: search, $options: "i" };
    }

    // Date range filter
    if (startDate || endDate) {
      filter.submittedAt = {};
      if (startDate) filter.submittedAt.$gte = new Date(startDate);
      if (endDate) filter.submittedAt.$lte = new Date(endDate + "T23:59:59");
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FeedbackResponse.countDocuments(filter);
    const responses = await FeedbackResponse.find(filter)
      .populate("studentId", "name email")
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: responses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      responses,
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/responses/my  (student)
const getMyResponses = async (req, res, next) => {
  try {
    const responses = await FeedbackResponse.find({ studentId: req.user._id })
      .populate("formId", "title description")
      .sort({ submittedAt: -1 });

    res.json({ success: true, count: responses.length, responses });
  } catch (error) {
    next(error);
  }
};

// @GET /api/responses/submitted-forms  (student) - list of formIds student already submitted
const getSubmittedFormIds = async (req, res, next) => {
  try {
    const responses = await FeedbackResponse.find(
      { studentId: req.user._id },
      "formId"
    );
    const submittedIds = responses.map((r) => r.formId.toString());
    res.json({ success: true, submittedIds });
  } catch (error) {
    next(error);
  }
};

// @GET /api/responses/analytics  (admin)
const getAnalytics = async (req, res, next) => {
  try {
    // Total responses across all forms
    const totalResponses = await FeedbackResponse.countDocuments();
    const totalForms = await FeedbackForm.countDocuments();

    // Responses per form
    const responsesPerForm = await FeedbackResponse.aggregate([
      {
        $group: {
          _id: "$formId",
          count: { $sum: 1 },
          avgRating: { $avg: "$averageRating" },
        },
      },
      {
        $lookup: {
          from: "feedbackforms",
          localField: "_id",
          foreignField: "_id",
          as: "form",
        },
      },
      { $unwind: "$form" },
      {
        $project: {
          formTitle: "$form.title",
          count: 1,
          avgRating: { $round: ["$avgRating", 2] },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Responses over last 30 days (daily trend)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrend = await FeedbackResponse.aggregate([
      { $match: { submittedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Overall average rating
    const overallAvg = await FeedbackResponse.aggregate([
      { $match: { averageRating: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$averageRating" } } },
    ]);

    // Rating distribution (how many 1s, 2s, 3s, 4s, 5s overall)
    const ratingDistribution = await FeedbackResponse.aggregate([
      { $unwind: "$answers" },
      { $match: { "answers.questionType": "rating" } },
      {
        $group: {
          _id: "$answers.value",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalResponses,
        totalForms,
        overallAvgRating: overallAvg[0]
          ? parseFloat(overallAvg[0].avg.toFixed(2))
          : 0,
        responsesPerForm,
        dailyTrend,
        ratingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @GET /api/responses/export/:formId  (admin) - returns CSV string
const exportResponsesCSV = async (req, res, next) => {
  try {
    const { formId } = req.params;

    const form = await FeedbackForm.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found." });

    const responses = await FeedbackResponse.find({ formId }).sort({
      submittedAt: -1,
    });

    if (responses.length === 0) {
      return res.status(404).json({ message: "No responses found for this form." });
    }

    // Build CSV header
    const questionHeaders = form.questions.map((q) => `"${q.text}"`).join(",");
    const header = `"Student Name","Student Email","Submitted At","Average Rating",${questionHeaders}`;

    // Build CSV rows
    const rows = responses.map((resp) => {
      const answerMap = {};
      resp.answers.forEach((ans) => {
        answerMap[ans.questionText] = ans.value;
      });

      const questionValues = form.questions
        .map((q) => {
          const val = answerMap[q.text];
          return val !== undefined ? `"${String(val).replace(/"/g, '""')}"` : '""';
        })
        .join(",");

      const submittedDate = new Date(resp.submittedAt).toLocaleString();
      return `"${resp.studentName}","${resp.studentEmail}","${submittedDate}","${resp.averageRating}",${questionValues}`;
    });

    const csvContent = [header, ...rows].join("\n");
    const filename = `${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitResponse,
  getResponsesByForm,
  getMyResponses,
  getSubmittedFormIds,
  getAnalytics,
  exportResponsesCSV,
};
