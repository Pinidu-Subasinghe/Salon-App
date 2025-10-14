import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    const { data } = await API.get("/bookings");
    setBookings(data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}/status`, { status });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Package</th>
                <th className="p-2">User</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t text-center">
                  <td>{b.packageId?.name}</td>
                  <td>{b.userName}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === "Pending" && (
                      <div className="space-x-2">
                        <button
                          onClick={() => updateStatus(b._id, "Confirmed")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "Completed")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
