import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const navigate = useNavigate();

  // If user already has a valid session, redirect away from login/register pages
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await API.get("/users/profile");
        // active session — redirect based on role
        if (data.role === "admin") navigate("/admin");
        else navigate("/");
      } catch (err) {
        // token/session invalid -> clear stored auth so user can log in
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", {
        phone: form.phone,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const afterLoginBooking = localStorage.getItem("afterLoginBooking");
      localStorage.removeItem("afterLoginBooking");

      if (data.user?.role === "admin") {
        navigate("/admin");
        return;
      }

      if (afterLoginBooking === "true") {
        window.location.href = "/";
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-sm sm:max-w-md mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5">Login to Continue</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Phone Number"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don’t have an account?{' '}
          <a className="text-blue-600 underline" href="/auth/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
