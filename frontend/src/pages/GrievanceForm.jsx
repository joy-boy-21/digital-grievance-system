//var 2

import React, { useContext, useState, useEffect } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function GrievanceForm() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    priority: "MEDIUM",
    isAnonymous: true,
    assignedDepartment: ""
  });
  
  const [notification, setNotification] = useState({ message: "", type: "" }); // 'success' or 'error'
  const [loading, setLoading] = useState(false);

  // Auto-clear notification after a few seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setNotification({ message: "Title and Description are required.", type: "error" });
      return;
    }

    setLoading(true);
    setNotification({ message: "", type: "" });

    try {
      const payload = { ...form, institutionId: user?.institutionId };
      await API.post("/grievances", payload);
      setNotification({ message: "Grievance submitted successfully!", type: "success" });
      // Reset form to initial state
      setForm({
        title: "", description: "", category: "Academic", priority: "MEDIUM", isAnonymous: true, assignedDepartment: ""
      });
    } catch (err) {
      setNotification({ message: err?.response?.data?.message || "Submission failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Submit a Grievance</h2>
        <p className="mb-6 text-gray-500">Your concerns are important. Please provide as much detail as possible.</p>

        {/* Notification Toast */}
        {notification.message && (
          <div className={`p-4 mb-4 rounded-lg text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.message}
          </div>
        )}
        
        <form onSubmit={submit} className="grid gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input id="title" name="title" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="e.g., Regarding Exam Schedule" value={form.title} onChange={handleInputChange} required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="description" name="description" rows="5" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="Please describe your issue in detail..." value={form.description} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select id="category" name="category" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white" value={form.category} onChange={handleInputChange}>
                <option>Academic</option>
                <option>Ragging</option>
                <option>Discrimination</option>
                <option>Harassment</option>
                <option>Infrastructure</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select id="priority" name="priority" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white" value={form.priority} onChange={handleInputChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="assignedDepartment" className="block text-sm font-medium text-gray-700 mb-1">Relevant Department (Optional)</label>
            <input id="assignedDepartment" name="assignedDepartment" className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="e.g., Examination Cell" value={form.assignedDepartment} onChange={handleInputChange} />
          </div>

          <div className="mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleInputChange} className="h-5 w-5 rounded text-purple-600 focus:ring-purple-500"/>
              <span className="text-gray-700 font-medium">Submit Anonymously</span>
            </label>
            <p className="text-xs text-gray-500 ml-8">Your identity will be kept confidential if you choose this option.</p>
          </div>
          
          <div className="flex justify-end mt-4">
            <button type="submit" disabled={loading} className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : "Submit Grievance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

