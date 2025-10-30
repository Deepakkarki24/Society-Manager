import React from "react";
import {
  FaUsers,
  FaClipboardList,
  FaRegCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/features/auth/authThunk.js";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };
  const stats = [
    {
      title: "Total Users",
      value: 120,
      icon: <FaUsers size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Queries",
      value: 85,
      icon: <FaClipboardList size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "Resolved",
      value: 65,
      icon: <FaRegCheckCircle size={24} />,
      color: "bg-green-500",
    },
    {
      title: "In Progress",
      value: 20,
      icon: <FaHourglassHalf size={24} />,
      color: "bg-orange-500",
    },
  ];

  const recentQueries = [
    {
      id: 1,
      title: "Streetlight not working",
      user: "Ravi Kumar",
      status: "Resolved",
    },
    {
      id: 2,
      title: "Water supply issue",
      user: "Priya Sharma",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Garbage collection delay",
      user: "Rahul Mehta",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-2 py-1 cursor-pointer bg-(--color-primary) rounded font-semibold text-white"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-5 bg-white rounded-2xl shadow hover:shadow-md transition"
          >
            <div className={`${item.color} text-white p-3 rounded-full mr-4`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Queries */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Queries
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-600">#</th>
              <th className="py-2 text-gray-600">Title</th>
              <th className="py-2 text-gray-600">User</th>
              <th className="py-2 text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentQueries.map((query) => (
              <tr key={query.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{query.id}</td>
                <td className="py-3">{query.title}</td>
                <td className="py-3">{query.user}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      query.status === "Resolved"
                        ? "bg-green-100 text-green-600"
                        : query.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {query.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
