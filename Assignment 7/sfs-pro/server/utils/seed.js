require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const FeedbackForm = require("../models/FeedbackForm");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sfs-pro");
  console.log("✅ Connected to MongoDB");
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await FeedbackForm.deleteMany({});
  console.log("🗑️  Cleared existing users and forms");

  // Create admin
  const admin = await User.create({
    name: "Admin User",
    email: "admin@sfs.com",
    password: "admin123",
    role: "admin",
  });
  console.log(`👤 Admin created: admin@sfs.com / admin123`);

  // Create sample students
  const student1 = await User.create({
    name: "Alice Johnson",
    email: "alice@student.com",
    password: "student123",
    role: "student",
  });
  const student2 = await User.create({
    name: "Bob Smith",
    email: "bob@student.com",
    password: "student123",
    role: "student",
  });
  console.log(`👤 Students created: alice@student.com, bob@student.com / student123`);

  // Create sample forms
  await FeedbackForm.create({
    title: "Faculty Feedback – Semester 1",
    description: "Please rate your experience with the faculty this semester.",
    createdBy: admin._id,
    questions: [
      { text: "How would you rate the teaching quality?", type: "rating", order: 1 },
      { text: "How well did the faculty explain concepts?", type: "rating", order: 2 },
      { text: "Rate the practical knowledge shared in class.", type: "rating", order: 3 },
      { text: "How accessible was the faculty for doubt-solving?", type: "rating", order: 4 },
      { text: "Any suggestions to improve teaching?", type: "text", required: false, order: 5 },
    ],
  });

  await FeedbackForm.create({
    title: "Event Feedback – Tech Fest 2024",
    description: "Share your experience from the annual Tech Fest.",
    createdBy: admin._id,
    questions: [
      { text: "How would you rate the overall event organization?", type: "rating", order: 1 },
      { text: "Rate the quality of technical sessions.", type: "rating", order: 2 },
      { text: "How satisfied were you with the venue and facilities?", type: "rating", order: 3 },
      { text: "Would you recommend this event to others?", type: "multiple_choice", options: ["Definitely", "Probably", "Not Sure", "No"], order: 4 },
      { text: "What did you enjoy most about the event?", type: "text", required: false, order: 5 },
    ],
  });

  console.log("📋 Sample feedback forms created");
  console.log("\n✅ Seed complete!\n");
  console.log("🔑 Login credentials:");
  console.log("   Admin  → admin@sfs.com     / admin123");
  console.log("   Student → alice@student.com / student123");
  console.log("   Student → bob@student.com   / student123\n");

  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
