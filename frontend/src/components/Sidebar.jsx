// import React from "react";
// import { Link } from "react-router-dom";

// export default function Sidebar({ user }) {
//   return (
//     <aside className="w-64 p-4 bg-white rounded-2xl shadow h-fit">
//       <div className="mb-6">
//         <div className="text-xs text-gray-400">Role</div>
//         <div className="font-semibold">{user?.role}</div>
//         <div className="text-xs text-gray-500">{user?.institutionId}</div>
//       </div>
//       <nav className="flex flex-col gap-2">
//         <Link to="/student" className="block py-2 px-3 rounded hover:bg-gray-100">Student Portal</Link>
//         <Link to="/submit" className="block py-2 px-3 rounded hover:bg-gray-100">Submit Grievance</Link>
//         <Link to="/admin" className="block py-2 px-3 rounded hover:bg-gray-100">Admin Dashboard</Link>
//       </nav>
//     </aside>
//   );
// }

import React from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiSend, FiUser } from "react-icons/fi"; // Added icons

export default function Sidebar({ user }) {
  const commonLinkClasses = "flex items-center gap-3 py-2.5 px-4 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-indigo-50 text-indigo-700 font-semibold";
  const inactiveLinkClass = "text-gray-600 hover:bg-gray-100";

  return (
    <aside className="w-64 p-4 bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
      <div className="p-4 mb-4 border-b border-gray-200">
        <div className="text-xs text-gray-400 uppercase tracking-wider">Role</div>
        <div className="font-bold text-lg text-gray-800">{user?.role}</div>
        <div className="text-xs text-gray-500 font-mono mt-1">{user?.institutionId}</div>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/student"
          className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiUser />
          <span>Student Portal</span>
        </NavLink>
        <NavLink
          to="/submit"
          className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiSend />
          <span>Submit Grievance</span>
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => `${commonLinkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
          <FiGrid />
          <span>Admin Dashboard</span>
        </NavLink>
      </nav>
    </aside>
  );
}
