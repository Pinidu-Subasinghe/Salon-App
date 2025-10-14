import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await API.post("/users/login", {
          phone: form.phone,
          password: form.password,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ check if login came from booking trigger
        const afterLoginBooking = localStorage.getItem("afterLoginBooking");
        localStorage.removeItem("afterLoginBooking");

        if (afterLoginBooking === "true") {
          window.location.href = "/"; // refresh home and open booking modal
        } else {
          navigate("/");
        }
      } else {
        if (form.password !== form.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        await API.post("/users/register", form);
        alert("Registered successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login to Continue" : "Create an Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full border p-2 rounded"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
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
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
