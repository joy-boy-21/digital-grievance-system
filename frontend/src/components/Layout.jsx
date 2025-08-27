import React, { useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-6">
        {user && (
          <aside>
            <Sidebar user={user} />
          </aside>
        )}
        <main className={user ? "col-span-3" : "col-span-4"}>
          {children}
        </main>
      </div>
    </>
  );
}
