import mongoose from "mongoose";

const CATEGORIES = [
  "Celebrity",
  "Television",
  "Bridal",
  "Editorial",
  "Fashion",
  "Beauty",
];

const portfolioItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export { CATEGORIES };
export default mongoose.model("PortfolioItem", portfolioItemSchema);
