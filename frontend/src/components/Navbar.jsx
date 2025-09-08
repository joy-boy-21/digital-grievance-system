// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const nav = useNavigate();

//   return (
//     <nav className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
//       <div className="flex items-center gap-4">
//         <Link to="/" className="text-xl font-bold text-primary">Grievance Portal</Link>
//         <span className="text-sm text-gray-500">Institution Prototype</span>
//       </div>
//       <div className="flex items-center gap-3">
//         {user ? (
//           <>
//             <div className="text-sm text-gray-700 mr-2">Hi, {user.name}</div>
//             <button className="btn btn-ghost" onClick={() => { logout(); nav("/login"); }}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="btn btn-ghost">Login</Link>
//             <Link to="/register" className="btn btn-primary">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi"; // Added icons

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
            Grievance Portal
          </Link>
          <span className="hidden sm:block text-sm text-gray-400 border-l border-gray-200 pl-4">
            Institution Prototype
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-right">
                <div className="font-medium text-gray-800">Hi, {user.name}</div>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 btn btn-ghost text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 btn btn-ghost text-gray-600 hover:bg-gray-100">
                <FiLogIn />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center gap-2 btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white">
                <FiUserPlus />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
