import React, { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import GrievanceItem from "../components/GrievanceItem";

export default function StudentPortal() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = user ? `?institutionId=${user.institutionId}` : "";
      const res = await API.get(`/grievances${user ? "" : ""}`);
      // backend will scope by token; for demo, client filters if necessary
      setList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Grievances</h1>
      {loading && <div>Loading...</div>}
      {!loading && list.length === 0 && <div className="card">No grievances found.</div>}
      <div className="mt-4">
        {list.map((g) => (
          <GrievanceItem key={g._id} g={g} onEscalate={() => {/* students can't escalate */}} />
        ))}
      </div>
    </div>
  );
}
