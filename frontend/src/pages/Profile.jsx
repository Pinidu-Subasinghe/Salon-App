import { useEffect, useState } from "react";
import API from "../api/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await API.get("/users/profile");
      setProfile(data);
      setForm(data);
    };
    loadProfile();
    loadBookings();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    await API.put("/users/profile", form);
    alert("Profile updated!");
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this pending booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      alert("Booking cancelled");
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700">
                {profile.fullName?.split(" ").map(s=>s[0]).slice(0,2).join("")}
              </div>
              <div>
                <div className="font-semibold text-lg">{profile.fullName}</div>
                <div className="text-sm text-gray-500">{profile.phone}</div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="mt-6 space-y-3">
              <div>
                <label className="text-sm text-gray-600">Full name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm text-gray-600">New password</label>
                <input name="password" type="password" placeholder="Optional" onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Save changes</button>
            </form>
          </div>
        </div>

        {/* Right: Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Appointments</h3>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">You have no appointments.</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded">
                    <div>
                      <div className="font-semibold">{b.packageId?.name || 'Service'}</div>
                      <div className="text-sm text-gray-600">{b.date} · {b.time}</div>
                      {/* Price display: prefer stored finalPrice, fallback to package price */}
                      {(() => {
                        const pkgPrice = Number(b.packageId?.price);
                        const final = Number(b.finalPrice);
                        const hasFinal = Number.isFinite(final) && final > 0;
                        const hasPkg = Number.isFinite(pkgPrice) && pkgPrice > 0;
                        if (b.discountApplied && hasFinal && hasPkg) {
                          return (
                            <div className="text-sm mt-1">
                              <span className="line-through text-gray-400 mr-2">£{pkgPrice.toFixed(2)}</span>
                              <span className="text-green-600 font-semibold">£{final.toFixed(2)}</span>
                            </div>
                          );
                        }
                        if (hasFinal) return <div className="text-sm mt-1">£{final.toFixed(2)}</div>;
                        if (hasPkg) return <div className="text-sm mt-1">£{pkgPrice.toFixed(2)}</div>;
                        return null;
                      })()}
                      {b.notes && <div className="text-sm text-gray-500 mt-1">{b.notes}</div>}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-white text-sm ${b.status === 'Pending' ? 'bg-yellow-500' : b.status === 'Confirmed' ? 'bg-green-600' : 'bg-gray-500'}`}>
                        {b.status}
                      </div>
                      {b.status === 'Pending' ? (
                        <button onClick={() => handleCancel(b._id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Cancel</button>
                      ) : (
                        <button disabled className="px-3 py-1 text-sm bg-gray-100 text-gray-500 rounded">Contact salon to change</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
