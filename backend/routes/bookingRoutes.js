import express from "express";
import {
  getBookings,
  addBooking,
  updateBookingStatus,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly, userOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.post("/", protect, userOnly, addBooking);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);
router.delete("/:id", protect, userOnly, cancelBooking);

export default router;
