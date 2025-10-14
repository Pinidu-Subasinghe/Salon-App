import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
