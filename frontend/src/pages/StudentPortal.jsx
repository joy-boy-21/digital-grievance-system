//var 2

import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import GrievanceItem from "../components/GrievanceItem"; // Assuming this component is styled

// Skeleton loader component to improve perceived performance
const GrievanceSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse mb-4">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    <div className="flex justify-between items-center mt-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// Engaging empty state component
const EmptyState = () => (
  <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-200">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900">No grievances found</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by submitting your first grievance.</p>
    <div className="mt-6">
      <Link to="/submit-grievance" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
        Submit Grievance
      </Link>
    </div>
  </div>
);


export default function StudentPortal() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Using useCallback to memoize the fetch function
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // The backend should scope by the authenticated user's token.
      // The query param is redundant if auth is handled correctly, but kept for consistency with original code.
      const res = await API.get(`/grievances?studentId=${user.id}`);
      setList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch grievances:", err);
      // Optionally set an error state to show a message to the user
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Grievances</h1>
           <Link to="/submit-grievance" className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
            + New Grievance
          </Link>
        </div>

        <div className="space-y-4">
          {loading && (
            <>
              <GrievanceSkeleton />
              <GrievanceSkeleton />
              <GrievanceSkeleton />
            </>
          )}

          {!loading && list.length === 0 && <EmptyState />}

          {!loading && list.length > 0 && list.map((g) => (
            <GrievanceItem 
              key={g._id} 
              g={g} 
              // Students cannot escalate, so this function does nothing.
              // A more robust implementation might hide the button entirely via a prop.
              onEscalate={() => {}} 
              isStudentView={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
