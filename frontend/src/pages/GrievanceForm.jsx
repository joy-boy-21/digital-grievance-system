import React, { useContext, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function GrievanceForm() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "", description: "", category: "Other", priority: "MEDIUM", isAnonymous: true, assignedDepartment: ""
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      // ensure institutionId present
      const institutionId = user?.institutionId || form.institutionId || prompt("Enter institutionId for demo (e.g., SATHYABAMA):");
      const payload = { ...form, institutionId };
      await API.post("/grievances", payload);
      setMsg("Grievance submitted!");
      setForm({ title: "", description: "", category: "Other", priority: "MEDIUM", isAnonymous: true, assignedDepartment: "" });
    } catch (err) {
      setMsg(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto card">
      <h2 className="text-xl font-bold mb-4">Submit Grievance</h2>
      {msg && <div className="text-sm text-green-600 mb-2">{msg}</div>}
      <form onSubmit={submit} className="grid gap-3">
        <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="flex gap-2">
          <select className="flex-1 border p-2 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Ragging</option>
            <option>Discrimination</option>
            <option>Academic</option>
            <option>Harassment</option>
            <option>Other</option>
          </select>
          <select className="w-44 border p-2 rounded" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <input className="border p-2 rounded" placeholder="Assigned Department (optional)" value={form.assignedDepartment} onChange={(e) => setForm({ ...form, assignedDepartment: e.target.value })} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} />
          Submit anonymously
        </label>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

