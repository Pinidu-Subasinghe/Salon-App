import { useEffect, useState } from "react";
import API from "../api/api";
import BookingModal from "../components/BookingModal";

export default function Pricing() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookPkg, setBookPkg] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await API.get("/packages", { params });
      setPackages(data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchPackages();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Pricing & Packages</h1>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <input
          className="border p-2 rounded w-full sm:flex-1"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="gents">Gents</option>
          <option value="woman">Woman</option>
        </select>
        <button className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded">
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading packages...</p>
      ) : packages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {packages.map((p) => (
            <div key={p._id} className="border rounded p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                <p className="mt-3 font-bold">£{Number(p.price).toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">Category: {p.category}</p>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => setBookPkg(p)}
                  className="px-3 py-1 rounded bg-black text-white"
                >
                  Book
                </button>
                {/* Admin: edit/delete could go here */}
              </div>
            </div>
          ))}
        </div>
      )}

      {bookPkg && (
          <BookingModal onClose={() => setBookPkg(null)} initialPackage={bookPkg} />
      )}
    </div>
  );
}
