import { useEffect, useState } from "react";
import API from "../api/api";
import AddPackageModal from "../components/AddPackageModal";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [income, setIncome] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadBookings = async () => {
    const { data } = await API.get("/bookings");
    setBookings(data);
  };

  const loadIncome = async () => {
    try {
      const { data } = await API.get("/bookings/analytics/income");
      setIncome(data);
    } catch (e) {
      console.error("Failed to load income analytics", e);
    }
  };

  const loadPackages = async () => {
    const { data } = await API.get("/packages");
    setPackages(data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/bookings/${id}/status`, { status });
    loadBookings();
  };

  const handleAdd = async (payload) => {
    if (editing) {
      await API.put(`/packages/${editing._id}`, payload).catch((e) => {
        console.error(e);
        alert("Failed to update package");
      });
      setEditing(null);
    } else {
      await API.post("/packages", payload).catch((e) => {
        console.error(e);
        alert("Failed to add package");
      });
    }
    setShowAdd(false);
    loadPackages();
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    await API.delete(`/packages/${id}`).catch((e) => {
      console.error(e);
      alert("Failed to delete package");
    });
    loadPackages();
  };

  useEffect(() => {
    loadBookings();
    loadPackages();
    loadIncome();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="p-2 text-left">Package</th>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Confirm</th>
                    <th className="p-2">Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-t text-sm align-middle">
                      <td className="p-2">{b.packageId?.name}</td>
                      <td className="p-2">{b.userName}</td>
                      <td className="p-2 text-center">
                        {new Date(b.date).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-center">{b.time}</td>
                      <td className="p-2 text-center">{b.finalPrice ? `£${Number(b.finalPrice).toFixed(2)}` : (b.packageId?.price ? `£${Number(b.packageId.price).toFixed(2)}` : '')}</td>
                      <td className="p-2 text-center">{b.status}</td>
                      <td className="p-2 text-center">
                        {b.status === "Pending" ? (
                          <button
                            onClick={() => updateStatus(b._id, "Confirmed")}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Confirm
                          </button>
                        ) : (
                          <div />
                        )}
                      </td>

                      <td className="p-2 text-center">
                        {(b.status === "Pending" || b.status === "Confirmed") ? (
                          <button
                            onClick={async () => { await updateStatus(b._id, "Completed"); loadBookings(); loadIncome(); }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Complete
                          </button>
                        ) : (
                          <div />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Income analytics section */}
        <section className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Daily Income (last 30 days)</h2>
          </div>
          <div>
            {(!income || income.length === 0) ? (
              <div className="text-gray-500">No income data yet.</div>
            ) : (
              <div className="space-y-2">
                {/* Bar chart (SVG) */}
                <div className="w-full overflow-x-auto">
                  {(() => {
                    // Build array of every date in the current month
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth(); // 0-11
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const monthDates = Array.from({ length: daysInMonth }, (_, idx) => {
                      const d = new Date(year, month, idx + 1);
                      const y = d.getFullYear();
                      const m = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      return { dateKey: `${y}-${m}-${day}`, label: `${d.getDate()}` };
                    });

                    // Map backend income rows into a lookup
                    const lookup = {};
                    income.forEach((r) => {
                      lookup[r._id] = Number(r.total);
                    });

                    const data = monthDates.map((md) => ({ date: md.dateKey, label: md.label, total: lookup[md.dateKey] || 0 }));

                    const max = Math.max(...data.map((d) => d.total), 1);
                    const width = Math.max(600, data.length * 22); // expand width if many days
                    const height = 220;
                    const padX = 40;
                    const padY = 30;
                    const plotW = width - padX * 2;
                    const plotH = height - padY * 2;
                    const barWidth = data.length > 0 ? Math.max(6, Math.floor(plotW / data.length) - 2) : 10;
                    const labelStep = Math.ceil(data.length / 12);

                    return (
                      <div className="w-full overflow-auto">
                        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
                          {/* grid lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => (
                            <line key={idx} x1={padX} x2={width - padX} y1={padY + plotH * t} y2={padY + plotH * t} stroke="#eee" />
                          ))}

                          {/* bars */}
                          {data.map((d, i) => {
                            const x = padX + i * (barWidth + 2);
                            const h = (d.total / max) * plotH;
                            const y = padY + (plotH - h);
                            return (
                              <g key={i}>
                                <rect x={x} y={y} width={barWidth} height={h} fill="#16a34a" rx={3} />
                                {i % labelStep === 0 && (
                                  <text x={x + barWidth / 2} y={height - padY + 14} fontSize={10} fill="#555" textAnchor="middle">
                                    {d.label}
                                  </text>
                                )}
                              </g>
                            );
                          })}

                          {/* y-axis labels */}
                          <text x={8} y={padY + plotH} fontSize={11} fill="#666">0</text>
                          <text x={8} y={padY} fontSize={11} fill="#666">£{max.toFixed(2)}</text>
                        </svg>
                      </div>
                    );
                  })()}
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-600">Total (shown period): <span className="font-semibold">£{income.reduce((s, r) => s + Number(r.total), 0).toFixed(2)}</span></div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Packages</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditing(null);
                  setShowAdd(true);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Add Package
              </button>
            </div>
          </div>

          {packages.length === 0 ? (
            <p>No packages. Add one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((p) => (
                    <tr key={p._id} className="border-t align-middle">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.description}</td>
                      <td className="p-2 text-center">${p.price}</td>
                      <td className="p-2 text-center">{p.category}</td>
                      <td className="p-2 text-center align-left">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => { setEditing(p); setShowAdd(true); }}
                            className="px-2 py-1 rounded border"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePackage(p._id)}
                            className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showAdd && (
        <AddPackageModal
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
          onSave={handleAdd}
          initial={editing}
        />
      )}
    </div>
  );
}
