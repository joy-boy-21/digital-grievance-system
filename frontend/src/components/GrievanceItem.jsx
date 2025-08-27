import React from "react";

export default function GrievanceItem({ g, onEscalate }) {
  return (
    <div className="card mb-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{new Date(g.createdAt).toLocaleString()}</div>
          <div className="text-lg font-semibold">{g.title} <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-100">{g.category}</span></div>
          <div className="text-sm text-gray-600 mt-2">{g.description}</div>
          <div className="text-xs text-gray-400 mt-2">Assigned: {g.assignedRole} {g.assignedDepartment ? `• ${g.assignedDepartment}` : ""}</div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="text-sm">{g.status}</div>
          <button className="btn btn-primary text-sm" onClick={() => onEscalate(g._id)}>Escalate</button>
        </div>
      </div>
    </div>
  );
}
