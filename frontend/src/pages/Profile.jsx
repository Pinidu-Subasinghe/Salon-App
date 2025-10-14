import { useEffect, useState } from "react";
import API from "../api/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await API.get("/users/profile");
      setProfile(data);
      setForm(data);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    await API.put("/users/profile", form);
    alert("Profile updated!");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="New Password (optional)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
