import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AuthContext } from "../context/AuthContext";

const COLORS = ["#6B21A8", "#F59E0B", "#2563EB", "#10B981"]; 
// purple, amber, blue, green

export default function Home() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/grievances");
      const list = res.data || [];

      // count by status
      const counts = list.reduce((acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        return acc;
      }, {});

      // convert to chart data
      const chartData = Object.keys(counts).map((status) => ({
        name: status,
        value: counts[status]
      }));

      setData(chartData);
    } catch (err) {
      console.error("Failed to fetch grievances:", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
      {data.length === 0 ? (
        <div className="text-sm text-gray-500">No grievances found for your institution.</div>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
