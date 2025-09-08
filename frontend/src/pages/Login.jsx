//Variant2

// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setErr("Both fields are required.");
//       return;
//     }
//     setErr("");  // Clear any previous error
//     setLoading(true);  // Start loading indicator

//     try {
//       await login(email, password);
//       nav("/"); // Navigate to homepage
//     } catch (error) {
//       setErr(error?.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);  // Stop loading indicator
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
//       <div className="w-full max-w-md card p-6 shadow-lg rounded-lg bg-white">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         {err && <div className="text-sm text-red-600 mb-2 text-center">{err}</div>}
//         <form onSubmit={submit} className="flex flex-col gap-4">
//           <input
//             className="border p-3 rounded-lg"
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             autoFocus
//           />
//           <input
//             className="border p-3 rounded-lg"
//             placeholder="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="submit"
//             className={`btn btn-primary p-3 rounded-lg mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// Variant 3

import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// An SVG icon component for visual flair. In a real app, this might be a library.
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErr("Email and password fields cannot be empty.");
      return;
    }
    setErr("");
    setLoading(true);

    try {
      await login(email, password);
      nav("/"); // Navigate to the main portal/dashboard on success
    } catch (error) {
      setErr(error?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <LockIcon />
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Grievance Portal</h1>
          <p className="text-gray-500">Sign in to access your account</p>
        </div>

        <div className="bg-white p-8 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Login</h2>
          
          {err && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <span className="block sm:inline">{err}</span>
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-600">Email</label>
              <input
                id="email"
                className="mt-1 border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-600">Password</label>
              <input
                id="password"
                className="mt-1 border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full btn btn-primary bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg mt-4 font-semibold transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-purple-600 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}