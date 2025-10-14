import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed"], default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
