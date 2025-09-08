import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Simple User Icon
const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);


export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [payload, setPayload] = useState({
    name: "", email: "", password: "", institutionId: ""
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!payload.name || !payload.email || !payload.password || !payload.institutionId) {
      setErr("All fields are required.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      await register(payload);
      nav("/"); // Navigate to home after successful registration
    } catch (error) {
      setErr(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPayload({ ...payload, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
       <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <UserPlusIcon />
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Create Your Account</h1>
          <p className="text-gray-500">Join the Grievance Redressal Platform</p>
        </div>

        <div className="bg-white p-8 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Register</h2>
          {err && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{err}</div>}
          
          <form onSubmit={submit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600" htmlFor="name">Full Name</label>
              <input id="name" name="name" className="mt-1 w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="John Doe" value={payload.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="mt-1 w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="john.doe@university.edu" value={payload.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600" htmlFor="password">Password</label>
              <input id="password" name="password" className="mt-1 w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="••••••••" type="password" value={payload.password} onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600" htmlFor="institutionId">Institution ID</label>
              <input id="institutionId" name="institutionId" className="mt-1 w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" placeholder="e.g., SATHYABAMA" value={payload.institutionId} onChange={handleChange} required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg mt-4 font-semibold transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-purple-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}