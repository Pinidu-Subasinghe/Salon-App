import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Income from "../models/Income.js";

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
      // User: see only their bookings (match by phone)
      bookings = await Booking.find({ userPhone: req.user.phone })
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
  const { packageId, date, time, notes } = req.body;

    // Get current logged-in user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch package to get price
    const PackageModel = await import("../models/Package.js");
    const Package = PackageModel.default;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    // Determine if this is user's first booking
    const existingCount = await Booking.countDocuments({ userId: user._id });
    const isFirst = existingCount === 0;

    const price = Number(pkg.price || 0);
    const discountPercent = isFirst ? 10 : 0;
    const discountAmount = Math.round((price * discountPercent) / 100 * 100) / 100;
    const finalPrice = Math.round((price - discountAmount) * 100) / 100;

    // Create booking with auto-filled user info and userId + discount fields
    const booking = new Booking({
      userName: user.fullName,
      userPhone: user.phone,
      userId: user._id,
      packageId,
      date,
      time,
      notes: notes || "",
      discountApplied: discountPercent > 0,
      discountPercent,
      discountAmount,
      finalPrice,
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
    const booking = await Booking.findById(req.params.id).populate("packageId", "price");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // If marking as Completed, record income and delete the booking
    if (status === "Completed") {
      const amount =
        typeof booking.finalPrice === "number" && booking.finalPrice > 0
          ? booking.finalPrice
          : (booking.packageId && booking.packageId.price) || 0;

      // create income record
      await Income.create({ bookingId: booking._id, amount, date: new Date() });

      // remove booking from DB (admin requested behavior)
      await Booking.findByIdAndDelete(booking._id);

      return res.json({ message: "Booking completed, income recorded" });
    }

    // For other status updates, just update
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get income aggregated by day (last 30 days)
export const getIncomeByDay = async (req, res) => {
  try {
    const days = 30;
    const since = new Date();
    since.setDate(since.getDate() - days + 1);

    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const rows = await Income.aggregate(pipeline);
    res.json(rows);
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

    // Only the same user or admin can cancel: check userId or phone fallback
    const isOwner = booking.userId
      ? booking.userId.toString() === req.user.id
      : booking.userPhone === req.user.phone;

    if (req.user.role !== "admin" && !isOwner)
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