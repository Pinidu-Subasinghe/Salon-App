import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    // Discount info (optional)
    discountApplied: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed"], default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
