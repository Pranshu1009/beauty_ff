import mongoose from "mongoose";

const academyImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    alt: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("AcademyImage", academyImageSchema);
