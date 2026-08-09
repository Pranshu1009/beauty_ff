import mongoose from "mongoose";

const sectionContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("SectionContent", sectionContentSchema);
