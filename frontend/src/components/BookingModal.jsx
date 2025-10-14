import { useEffect, useState } from "react";
import API from "../api/api";

export default function BookingModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]); // ✅ Dynamic packages from DB
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const timeSlots = [
    "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM",
  ];

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

  const handleConfirm = async () => {
    try {
      await API.post("/bookings", {
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        ...form,
      });
      alert("✅ Booking confirmed successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

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
                      <span>{s.price ? `£${s.price}` : "N/A"}</span>
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
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Select Time
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto border rounded p-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={`text-sm py-1.5 border rounded ${
                        selectedTime === t
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
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
                  if (selectedService && selectedDate && selectedTime)
                    setStep(2);
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
                placeholder="First Name"
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                placeholder="Last Name"
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
              <input
                placeholder="Email"
                className="border p-2 rounded w-full"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Phone Number"
                className="border p-2 rounded w-full"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <textarea
                placeholder="Special Requests (Optional)"
                className="border p-2 rounded w-full"
                rows={2}
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
                  if (form.firstName && form.phone && form.email) setStep(3);
                  else alert("Please fill all required fields.");
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
              <p>
                <strong>Date:</strong> {selectedDate}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
              <p>
                <strong>Name:</strong> {form.firstName} {form.lastName}
              </p>
              <p>
                <strong>Email:</strong> {form.email}
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
