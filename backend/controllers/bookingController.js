import Booking from "../models/Booking.js";
import User from "../models/User.js";

// ✅ Get all bookings (admin) or own bookings (user)
export const getBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "admin") {
      // Admin: see all bookings
      bookings = await Booking.find()
        .populate("packageId", "name price")
        .sort({ createdAt: -1 });
    } else {
      // User: see only their bookings
      bookings = await Booking.find({ userEmail: req.user.phone })
        .populate("packageId", "name price")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add new booking (auto fetch user details)
export const addBooking = async (req, res) => {
  try {
    const { packageId, date } = req.body;

    // Get current logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create booking with auto-filled user info
    const booking = new Booking({
      userName: user.fullName,
      userEmail: user.phone,
      packageId,
      date,
    });

    await booking.save();

    res.status(201).json({
      message:
        "Booking created successfully! You can cancel it while status is 'Pending'. Once confirmed, contact the salon directly.",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Cancel booking (user only while Pending)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // Only the same user or admin can cancel
    if (req.user.role !== "admin" && booking.userEmail !== req.user.phone)
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });

    // Allow cancel only if Pending
    if (booking.status !== "Pending")
      return res.status(400).json({
        message:
          "You can cancel only while status is 'Pending'. Contact the salon for confirmed bookings.",
      });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};