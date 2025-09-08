//var 2

import React, { useContext, useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Assuming styled
import Navbar from "../components/Navbar"; // Assuming styled
import GrievanceItem from "../components/GrievanceItem"; // Assuming styled

// Icon components for dashboard cards
const AllIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const PendingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const EscalatedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition-all hover:shadow-lg hover:scale-105">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    {icon}
  </div>
);


export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, escalated: 0 });
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`/grievances?${params}`);
      const data = res.data || [];
      
      setGrievances(data);
      setCounts({
        total: data.length,
        pending: data.filter((g) => g.status === "PENDING").length,
        escalated: data.filter((g) => g.status === "ESCALATED").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchList();
    // Setting up polling interval
    const intervalId = setInterval(fetchList, 8000);
    return () => clearInterval(intervalId);
  }, [fetchList]);

  const handleEscalate = async (id) => {
    if (!window.confirm("Are you sure you want to escalate this grievance?")) return;
    try {
      await API.put(`/grievances/${id}/escalate`, { reason: "Manual escalation by admin" });
      fetchList(); // Re-fetch immediately after action
      alert("Grievance escalated successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Escalation failed.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  
  const resetFilters = () => {
    setFilters({ status: "", priority: "" });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <DashboardCard title="Total Grievances" value={counts.total} icon={<AllIcon />} />
            <DashboardCard title="Pending Review" value={counts.pending} icon={<PendingIcon />} />
            <DashboardCard title="Escalated" value={counts.escalated} icon={<EscalatedIcon />} />
          </div>

          {/* Grievance List and Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
              <h3 className="text-xl font-semibold text-gray-800">Grievance Feed</h3>
              <div className="flex gap-3 items-center">
                <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ESCALATED">Escalated</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <select name="priority" value={filters.priority} onChange={handleFilterChange} className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none">
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <button className="btn btn-ghost text-sm text-gray-600 hover:bg-gray-200 p-2 rounded-lg" onClick={resetFilters}>Reset</button>
              </div>
            </div>

            <div className="space-y-4">
              {loading && <p>Loading grievances...</p>}
              {!loading && grievances.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <h4 className="text-lg font-medium">No grievances match the current filters.</h4>
                  <p className="text-sm">Try adjusting or resetting the filters.</p>
                </div>
              )}
              {grievances.map((g) => (
                <GrievanceItem key={g._id} g={g} onEscalate={handleEscalate} isAdminView={true} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
