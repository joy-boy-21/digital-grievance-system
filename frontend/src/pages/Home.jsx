//var 2

import React, { useEffect, useState, useContext, useCallback } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuthContext } from "../context/AuthContext";

// A more professional color palette
const COLORS = {
  PENDING: "#F59E0B",     // Amber
  IN_PROGRESS: "#3B82F6", // Blue
  RESOLVED: "#10B981",    // Green
  ESCALATED: "#EF4444",   // Red
};

// Custom label for the pie chart to make it look cleaner
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="font-semibold text-sm">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Home() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // API call should be scoped to the user's institution by the backend
      const res = await API.get("/grievances");
      const list = res.data || [];

      const counts = list.reduce((acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.keys(counts).map((status) => ({
        name: status.replace("_", " "),
        value: counts[status],
        color: COLORS[status] || "#6B7280" // Default gray color
      }));

      setData(chartData);
    } catch (err) {
      console.error("Failed to fetch grievances:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user ? user.name : "Admin"}!
        </h1>
        <p className="text-gray-500 mb-6">Here's a summary of grievance statuses across the institution.</p>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Dashboard Overview</h2>
          
          {loading && (
            <div className="w-full h-80 flex items-center justify-center">
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="w-full h-80 flex flex-col items-center justify-center text-center text-gray-500">
               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <h3 className="mt-2 text-lg font-medium text-gray-900">No Data Available</h3>
               <p className="mt-1 text-sm">There are no grievances to display at this time.</p>
            </div>
          )}
          
          {!loading && data.length > 0 && (
            <div className="w-full h-96">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}