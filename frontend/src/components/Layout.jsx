// import React, { useContext } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import { AuthContext } from "../context/AuthContext";

// export default function Layout({ children }) {
//   const { user } = useContext(AuthContext);

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-6">
//         {user && (
//           <aside>
//             <Sidebar user={user} />
//           </aside>
//         )}
//         <main className={user ? "col-span-3" : "col-span-4"}>
//           {children}
//         </main>
//       </div>
//     </>
//   );
// }

import React, { useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {user && (
          <aside className="col-span-1">
            <Sidebar user={user} />
          </aside>
        )}
        <main className={user ? "col-span-1 md:col-span-3" : "col-span-1 md:col-span-4"}>
          {children}
        </main>
      </div>
    </div>
  );
}
