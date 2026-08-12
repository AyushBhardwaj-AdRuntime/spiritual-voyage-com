import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  pending: { type: Boolean, default: false },
});

export const FAQModel = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
