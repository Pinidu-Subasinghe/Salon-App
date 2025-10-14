import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({ title: "", fullName: "", phone: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await API.post("/users/register", form);
      alert("Registered successfully! Please log in.");
      navigate("/auth/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-sm sm:max-w-md mx-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            className="w-full border p-2 rounded bg-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>

          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{' '}
          <a className="text-blue-600 underline" href="/auth/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
