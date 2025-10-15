import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    // ignore
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((s) => s[0]).slice(0, 2).join("")
    : "U";

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-gray-900">Salon Monaz</Link>
        <div className="flex items-center gap-6">
          <Link to="/pricing" className="hover:text-blue-600 font-medium">Pricing</Link>
          {token ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 border p-1 rounded-full hover:shadow"
                title={user?.fullName || "Profile"}
              >
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {initials}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
