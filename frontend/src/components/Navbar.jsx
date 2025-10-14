import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-gray-900">Salon Monaz</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
          {token ? (
            <>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Book Appointment
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
