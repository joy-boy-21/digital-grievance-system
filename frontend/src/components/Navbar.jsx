import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  return (
    <nav className="w-full bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-primary">Grievance Portal</Link>
        <span className="text-sm text-gray-500">Institution Prototype</span>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="text-sm text-gray-700 mr-2">Hi, {user.name}</div>
            <button className="btn btn-ghost" onClick={() => { logout(); nav("/login"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
