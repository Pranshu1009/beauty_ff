import mongoose from "mongoose";

const showItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ShowItem", showItemSchema);
