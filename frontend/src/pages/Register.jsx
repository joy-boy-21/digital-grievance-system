import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [payload, setPayload] = useState({
    name: "", email: "", password: "", institutionId: ""
  });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(payload);
      nav("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg card">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
        <form onSubmit={submit} className="grid grid-cols-1 gap-3">
          <input className="border p-2 rounded" placeholder="Full name" value={payload.name} onChange={(e) => setPayload({ ...payload, name: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Email" value={payload.email} onChange={(e) => setPayload({ ...payload, email: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Password" type="password" value={payload.password} onChange={(e) => setPayload({ ...payload, password: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Institution ID (e.g., SATHYABAMA)" value={payload.institutionId} onChange={(e) => setPayload({ ...payload, institutionId: e.target.value })} />
          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}
