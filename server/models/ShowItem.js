import mongoose from "mongoose";

const showItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    images: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one image is required.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("ShowItem", showItemSchema);
