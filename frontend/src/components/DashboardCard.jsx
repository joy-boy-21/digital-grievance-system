/* Variant 1
import React from "react";

export default function DashboardCard({ title, value, children }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

*/

// Variant 2

// import React from "react";

// // Optional: Import icons for different statuses
// import { FaCheckCircle, FaExclamationCircle, FaRegHourglass } from 'react-icons/fa';

// export default function DashboardCard({ title, value, status, children }) {
//   // Set colors and icons based on the status of the grievance
//   const getStatusDetails = (status) => {
//     switch (status) {
//       case 'resolved':
//         return { color: 'text-green-500', icon: <FaCheckCircle className="text-green-500" /> };
//       case 'pending':
//         return { color: 'text-yellow-500', icon: <FaRegHourglass className="text-yellow-500" /> };
//       case 'escalated':
//         return { color: 'text-red-500', icon: <FaExclamationCircle className="text-red-500" /> };
//       default:
//         return { color: 'text-gray-400', icon: null };
//     }
//   };

//   const { color, icon } = getStatusDetails(status);

//   return (
//     <div className="card p-4 shadow-md rounded-lg border border-gray-200">
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="text-xs text-gray-400">{title}</div>
//           <div className="text-2xl font-bold text-gray-800">{value}</div>
//         </div>
//         <div className="flex items-center space-x-2">
//           {icon && <div className="text-xl">{icon}</div>}
//           {children}
//         </div>
//       </div>
//       <div className={`mt-2 text-sm ${color}`}>
//         {status && status.charAt(0).toUpperCase() + status.slice(1)}
//       </div>
//     </div>
//   );
//}

import React from "react";
import { FaCheckCircle, FaExclamationCircle, FaRegHourglass } from 'react-icons/fa';

export default function DashboardCard({ title, value, status, children }) {
  const getStatusDetails = (status) => {
    switch (status) {
      case 'resolved':
        return {
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: <FaCheckCircle />,
          iconBg: 'bg-green-100',
        };
      case 'pending':
        return {
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: <FaRegHourglass />,
          iconBg: 'bg-yellow-100',
        };
      case 'escalated':
        return {
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: <FaExclamationCircle />,
          iconBg: 'bg-red-100',
        };
      default:
        return {
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: null,
          iconBg: 'bg-gray-100',
        };
    }
  };

  const { textColor, borderColor, icon, iconBg } = getStatusDetails(status);

  return (
    <div className={`bg-white p-6 shadow-sm rounded-xl border ${borderColor} transition-all hover:shadow-md hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 font-medium">{title}</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>
        </div>
        {icon && (
          <div className={`p-3 rounded-full ${iconBg} ${textColor}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

