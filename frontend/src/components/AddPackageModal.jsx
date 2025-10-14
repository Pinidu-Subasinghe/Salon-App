import { useState } from "react";

export default function AddPackageModal({ onClose, onSave, initial = null }) {
  const [form, setForm] = useState(
    initial || { name: "", description: "", price: "" }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4">{initial ? "Edit Package" : "Add Package"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Package name"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded h-24"
          />
          <input
            name="price"
            required
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
            <button type="submit" className="px-4 py-1 rounded bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
