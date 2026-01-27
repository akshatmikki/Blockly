"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Edit, Trash2, KeyRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type User = {
  UserId: number;
  Email: string;
  Username: string;
  Role: string;
  IsActive: boolean;
  CreatedOn?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  useEffect(() => {
    console.log("AdminDashboard: Fetching users...");
    fetch("/api/auth/admin/users", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        console.log("AdminDashboard: Response status:", res.status);
        if (res.status === 401 || res.status === 403) {
          console.log("AdminDashboard: Unauthorized/Forbidden, redirecting to /login");
          router.push("/login");
          return [];
        }
        if (!res.ok) {
          console.error("AdminDashboard: Error response:", res.status);
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("AdminDashboard: Received users:", data);
        setUsers(data);
      })
      .catch((err) => {
        console.error("AdminDashboard: Fetch error:", err);
        router.push("/login");
      });
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  }

  // Mock data for charts
  const activeCount = users.filter(u => u.IsActive).length;
  const inactiveCount = users.filter(u => !u.IsActive).length;

  const pieData = [
    { name: "Active Users", value: activeCount, color: "#FF6B6B" },
    { name: "Inactive Users", value: inactiveCount, color: "#FFE66D" },
  ];

  // Mock login count data
  const loginCountData = users.slice(0, 5).map((user, idx) => ({
    name: user.Username || user.Email.split('@')[0],
    logins: Math.floor(Math.random() * 50) + 10,
  }));

  // Mock online users data based on time range
  const getOnlineUsersData = () => {
    if (timeRange === "week") {
      return [
        { name: "Mon", users: 12 },
        { name: "Tue", users: 19 },
        { name: "Wed", users: 15 },
        { name: "Thu", users: 25 },
        { name: "Fri", users: 22 },
        { name: "Sat", users: 18 },
        { name: "Sun", users: 10 },
      ];
    } else if (timeRange === "month") {
      return [
        { name: "Week 1", users: 45 },
        { name: "Week 2", users: 52 },
        { name: "Week 3", users: 48 },
        { name: "Week 4", users: 61 },
      ];
    } else {
      return [
        { name: "Jan", users: 120 },
        { name: "Feb", users: 150 },
        { name: "Mar", users: 180 },
        { name: "Apr", users: 170 },
        { name: "May", users: 200 },
        { name: "Jun", users: 190 },
        { name: "Jul", users: 210 },
        { name: "Aug", users: 230 },
        { name: "Sep", users: 220 },
        { name: "Oct", users: 240 },
        { name: "Nov", users: 250 },
        { name: "Dec", users: 260 },
      ];
    }
  };

  const handleEdit = (userId: number) => {
    console.log("Edit user:", userId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (userId: number) => {
    console.log("Delete user:", userId);
    // TODO: Implement delete functionality
  };

  const handleResetPassword = (userId: number) => {
    console.log("Reset password for user:", userId);
    router.push(`/admin_dashboard/reset-apssword/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button
            onClick={logout}
            className="bg-orange-500 hover:bg-orange-600 cursor-pointer flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-orange-500">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Active Users</h3>
            <p className="text-4xl font-bold text-green-500">{activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Inactive Users</h3>
            <p className="text-4xl font-bold text-red-500">{inactiveCount}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart - Active vs Inactive */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Login Counts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Login Frequency</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loginCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Bar dataKey="logins" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Users Online Over Time */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Users Online</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setTimeRange("week")}
                className={`cursor-pointer ${
                  timeRange === "week"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Week
              </Button>
              <Button
                onClick={() => setTimeRange("month")}
                className={`cursor-pointer ${
                  timeRange === "month"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Month
              </Button>
              <Button
                onClick={() => setTimeRange("year")}
                className={`cursor-pointer ${
                  timeRange === "year"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Year
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getOnlineUsersData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#FF6B6B"
                strokeWidth={3}
                dot={{ fill: "#FF6B6B", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-orange-100">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.UserId} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800">{user.UserId}</td>
                    <td className="py-3 px-4 text-gray-800">{user.Email}</td>
                    <td className="py-3 px-4 text-gray-800">{user.Username || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.Role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.Role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.IsActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {user.IsActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(user.UserId)}
                          className="bg-blue-500 hover:bg-blue-600 cursor-pointer p-2"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleResetPassword(user.UserId)}
                          className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer p-2"
                          title="Reset Password"
                        >
                          <KeyRound size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.UserId)}
                          className="bg-red-500 hover:bg-red-600 cursor-pointer p-2"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
