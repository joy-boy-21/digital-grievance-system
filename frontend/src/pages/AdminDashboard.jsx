import React, { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import GrievanceItem from "../components/GrievanceItem";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, escalated: 0 });
  const [filters, setFilters] = useState({ status: "", priority: "", category: "" });

  const fetchList = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.category) params.append("category", filters.category);
      const res = await API.get(`/grievances?${params.toString()}`);
      setGrievances(res.data || []);
      const total = res.data.length;
      const pending = res.data.filter((g) => g.status === "PENDING").length;
      const escal = res.data.filter((g) => g.status === "ESCALATED").length;
      setCounts({ total, pending, escalated: escal });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
    // poll for changes every 8s (demo realtime)
    const id = setInterval(fetchList, 8000);
    return () => clearInterval(id);
  }, [filters]);

  const handleEscalate = async (id) => {
    try {
      await API.put(`/grievances/${id}/escalate`, { reason: "Manual escalation from UI" });
      fetchList();
      alert("Escalation triggered");
    } catch (err) {
      alert(err?.response?.data?.message || "Escalation failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 grid grid-cols-4 gap-6">
        <aside>
          <Sidebar user={user} />
        </aside>
        <main className="col-span-3">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <DashboardCard title="Total Grievances" value={counts.total} />
            <DashboardCard title="Pending" value={counts.pending} />
            <DashboardCard title="Escalated" value={counts.escalated} />
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Grievance List</h3>
              <div className="flex gap-2 items-center">
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="border p-2 rounded">
                  <option value="">All statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="ESCALATED">ESCALATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
                <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })} className="border p-2 rounded">
                  <option value="">All priorities</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
                <button className="btn btn-ghost" onClick={() => setFilters({ status: "", priority: "", category: "" })}>Reset</button>
              </div>
            </div>

            <div>
              {grievances.length === 0 && <div className="p-4 text-sm text-gray-500">No grievances</div>}
              {grievances.map((g) => (
                <GrievanceItem key={g._id} g={g} onEscalate={handleEscalate} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
