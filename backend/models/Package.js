import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    // category: 'gents' or 'woman'
    category: {
      type: String,
      enum: ["gents", "woman"],
      required: true,
      default: "gents",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
