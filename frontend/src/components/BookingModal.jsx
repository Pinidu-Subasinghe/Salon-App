import { useEffect, useState } from "react";
import API from "../api/api";

export default function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]); // ✅ Dynamic packages from DB
  const [isFirstBooking, setIsFirstBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    notes: "",
  });

  const timeSlots = [
    "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM",
  ];

  // Helper: get current date/time parts in Sri Lanka timezone (Asia/Colombo)
  const getSriLankaNow = () => {
    const now = new Date();
    const dtf = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(now).reduce((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
    const year = parts.year;
    const month = parts.month;
    const day = parts.day;
    const hour = parseInt(parts.hour, 10);
    const minute = parseInt(parts.minute, 10);
    return { year, month, day, hour, minute };
  };

  const sriNow = getSriLankaNow();
  const todaySL = `${sriNow.year}-${sriNow.month}-${sriNow.day}`; // YYYY-MM-DD

  // parse time slot e.g. "9:00 AM" -> minutes since midnight
  const slotToMinutes = (slot) => {
    const m = slot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h * 60 + min;
  };

  const nowMinutes = sriNow.hour * 60 + sriNow.minute;

  const isSlotDisabled = (slot) => {
    if (!selectedDate) return false;
    // only disable slots if user picked today's date in Sri Lanka
    if (selectedDate !== todaySL) return false;
    const slotMin = slotToMinutes(slot);
    // disable if slot is earlier than current time
    return slotMin <= nowMinutes - 1; // strictly before now
  };

  // ✅ Fetch available services/packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await API.get("/packages");
        setServices(data); // assume data = [{ name, price, duration, description }]
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };
    fetchPackages();
  }, []);

  // ✅ Check if current logged-in user has previous bookings -> first booking eligibility
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in -> cannot check server-side bookings

    const checkBookings = async () => {
      try {
        const { data } = await API.get("/bookings");
        // backend returns an array of bookings for the logged in user
        if (Array.isArray(data)) setIsFirstBooking(data.length === 0);
      } catch (err) {
        // silently ignore - user might not be authenticated properly
        console.error("Error checking user bookings:", err);
      }
    };

    checkBookings();
  }, []);

  const handleConfirm = async () => {
    try {
      // compute discount info for payload (frontend only)
      const price = selectedService?.price ? Number(selectedService.price) : 0;
      const discountPercent = isFirstBooking ? 10 : 0;
      const discountAmount = Math.round((price * discountPercent) / 100 * 100) / 100;
      const finalPrice = Math.round((price - discountAmount) * 100) / 100;

      await API.post("/bookings", {
        packageId: selectedService._id || selectedService.id,
        date: selectedDate,
        time: selectedTime,
        ...form,
        discountApplied: discountPercent > 0,
        discountPercent,
        discountAmount,
        finalPrice,
      });
      alert("✅ Booking confirmed successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  // Auto-fill form from logged-in user if available
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
  setForm((f) => ({ ...f, fullName: u.fullName || "", phone: u.phone || "" }));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // guard: if logged in user is admin, do not allow booking
  const _userStr = localStorage.getItem("user");
  const _loggedUser = _userStr ? JSON.parse(_userStr) : null;
  if (_loggedUser && _loggedUser.role === "admin") {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-lg p-5 relative">
          <h2 className="text-xl font-semibold mb-3">Access denied</h2>
          <p className="text-sm text-gray-600 mb-4">Admins are not allowed to create bookings.</p>
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      </div>
    );
  }

  // computed price/discount values (frontend display)
  const selectedPrice = selectedService?.price ? Number(selectedService.price) : 0;
  const discountPercent = isFirstBooking ? 10 : 0;
  const discountAmount = Math.round((selectedPrice * discountPercent) / 100 * 100) / 100;
  const finalPrice = Math.round((selectedPrice - discountAmount) * 100) / 100;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-lg p-5 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Step 1 — Select Service, Date, Time */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Book Appointment
            </h2>
            <p className="text-gray-500 text-center mb-4 text-sm">
              Step 1 of 3 — Choose your service, date & time
            </p>

            {/* ✅ Dynamic packages */}
            <div className="space-y-2 mb-4">
              {services.length > 0 ? (
                services.map((s) => (
                  <div
                    key={s._id || s.name}
                    onClick={() => setSelectedService(s)}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedService?.name === s.name
                        ? "border-black bg-gray-100"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{s.name}</span>
                      <span>
                        {(() => {
                          const p = Number(s.price);
                          if (!Number.isFinite(p)) return "N/A";
                          if (isFirstBooking) {
                            const disc = Math.round(p * 0.1 * 100) / 100;
                            const fp = Math.round((p - disc) * 100) / 100;
                            return (
                              <>
                                <span className="line-through text-gray-400 mr-2">£{p.toFixed(2)}</span>
                                <span className="text-green-600 font-semibold">£{fp.toFixed(2)} (10% off)</span>
                              </>
                            );
                          }
                          return `£${p.toFixed(2)}`;
                        })()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {s.duration ? `${s.duration} min` : ""}
                    </p>
                    {s.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {s.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm">
                  Loading services...
                </p>
              )}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todaySL}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    // clear time if it becomes invalid for the new date
                    setSelectedTime((prev) => {
                      if (!e.target.value) return prev;
                      // if new date is today, and previously selected time is now disabled, clear it
                      if (e.target.value === todaySL && isSlotDisabled(prev)) return "";
                      return prev;
                    });
                  }}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border rounded p-2">
                  {timeSlots.map((t) => {
                    const disabled = isSlotDisabled(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => !disabled && setSelectedTime(t)}
                        disabled={disabled}
                        className={`text-sm py-1.5 border rounded ${
                          selectedTime === t
                            ? "bg-black text-white"
                            : disabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const hasService = !!selectedService;
                  const hasDate = selectedDate && selectedDate.toString().trim().length > 0;
                  const hasTime = selectedTime && selectedTime.toString().trim().length > 0;
                  if (hasService && hasDate && hasTime) setStep(2);
                  else alert("Please select service, date, and time!");
                }}
                className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-900"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 2 — User Info */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Your Details
            </h2>
            <p className="text-gray-500 text-center mb-4 text-sm">
              Step 2 of 3 — Fill your information
            </p>

            <div className="space-y-3 mb-5">
              <input
                placeholder="Full Name"
                value={form.fullName}
                className="border p-2 rounded w-full"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                readOnly={!!localStorage.getItem("user")}
              />
              <input
                placeholder="Phone Number"
                value={form.phone}
                className="border p-2 rounded w-full"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                readOnly={!!localStorage.getItem("user")}
              />
              <textarea
                placeholder="Special Requests (Optional)"
                className="border p-2 rounded w-full"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded border text-sm"
              >
                Back
              </button>
              <button
                onClick={() => {
                  // Email is optional; require full name and phone
                  if (form.fullName && form.phone) setStep(3);
                  else alert("Please fill your full name and phone number.");
                }}
                className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-900"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Confirm Appointment
            </h2>
            <p className="text-gray-500 text-center mb-4 text-sm">
              Step 3 of 3 — Review & Confirm
            </p>

            <div className="text-sm space-y-2 mb-6">
              <p>
                <strong>Service:</strong> {selectedService?.name}
              </p>
                      {selectedPrice > 0 && (
                        <p>
                          <strong>Price:</strong>{' '}
                          {discountPercent > 0 ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">£{selectedPrice.toFixed(2)}</span>
                              <span className="text-green-600 font-semibold">£{finalPrice.toFixed(2)} ({discountPercent}% off)</span>
                            </>
                          ) : (
                            `£${selectedPrice.toFixed(2)}`
                          )}
                        </p>
                      )}
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Name:</strong> {form.fullName}
              </p>
              
              <p>
                <strong>Phone:</strong> {form.phone}
              </p>
              {form.notes && (
                <p>
                  <strong>Notes:</strong> {form.notes}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded border text-sm"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-900"
              >
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
