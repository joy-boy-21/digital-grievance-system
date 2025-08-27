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

  return <div className="card">Redirecting...</div>;
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


/*export default function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<div className="card">Welcome to the Digital Grievance Portal prototype. Use the navigation to try features.</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit" element={<GrievanceForm />} />
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={[]}>
              <StudentPortal />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["HOD", "DEAN", "CHANCELLOR", "ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<div className="card">Page not found — <Link to="/">Go home</Link></div>} />
        </Routes>
      </div>
    </>
  );
}

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

  return <div className="card">Redirecting...</div>;
}
*/