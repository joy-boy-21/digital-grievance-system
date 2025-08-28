import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GrievanceForm from "./pages/GrievanceForm";
import StudentPortal from "./pages/StudentPortal";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import Layout from "./components/Layout";

/*function Home() {
  return <div className="card">Welcome! Use the sidebar to navigate.</div>;
} */

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (user?.role === "STUDENT") nav("/submit");
    else if (["HOD","DEAN","CHANCELLOR","ADMIN"].includes(user?.role)) nav("/admin");
  }, [user]);

  return <div className="card">The HomePage</div>;
}


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/submit" element={<Layout><GrievanceForm /></Layout>} />
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <Layout><StudentPortal /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["HOD","DEAN","CHANCELLOR","ADMIN"]}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
