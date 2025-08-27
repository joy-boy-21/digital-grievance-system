import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user }) {
  return (
    <aside className="w-64 p-4 bg-white rounded-2xl shadow h-fit">
      <div className="mb-6">
        <div className="text-xs text-gray-400">Role</div>
        <div className="font-semibold">{user?.role}</div>
        <div className="text-xs text-gray-500">{user?.institutionId}</div>
      </div>
      <nav className="flex flex-col gap-2">
        <Link to="/student" className="block py-2 px-3 rounded hover:bg-gray-100">Student Portal</Link>
        <Link to="/submit" className="block py-2 px-3 rounded hover:bg-gray-100">Submit Grievance</Link>
        <Link to="/admin" className="block py-2 px-3 rounded hover:bg-gray-100">Admin Dashboard</Link>
      </nav>
    </aside>
  );
}
