import Booking from "../models/Booking.js";

// ✅ Get all bookings (admin) or own bookings (user)
export const getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === "admin") {
      bookings = await Booking.find().populate("packageId", "name price");
    } else {
      bookings = await Booking.find({ userEmail: req.user.phone }).populate("packageId", "name price");
    }
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add new booking
export const addBooking = async (req, res) => {
  try {
    const { userName, userEmail, packageId, date } = req.body;
    const booking = new Booking({ userName, userEmail, packageId, date });
    await booking.save();
    res.status(201).json({
      message:
        "Booking created successfully! You can cancel it while status is 'Pending'. Once confirmed, contact the salon directly.",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update booking status (admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Cancel booking (user only while Pending)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && booking.userEmail !== req.user.phone)
      return res.status(403).json({ message: "Not authorized to cancel this booking" });

    if (booking.status !== "Pending")
      return res.status(400).json({
        message:
          "You can cancel only while status is 'Pending'. Contact the salon for confirmed bookings."
      });

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
