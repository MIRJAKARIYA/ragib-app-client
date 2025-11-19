// src/pages/admin/Users.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiUsers, FiSearch, FiShield, FiUserCheck, FiMail, FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Users() {
  const { user: adminUser } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch All Users
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const token = await adminUser.getIdToken();
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Toggle Admin Role
  const toggleRoleMutation = useMutation({
    mutationFn: async (uid) => {
      const token = await adminUser.getIdToken();
      await axios.put(
        `http://localhost:5000/api/users/${uid}/role`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("User role updated!");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiUsers size={40} />
          Users Management
        </h1>

        <div className="relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered pl-10 w-80"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <p className="text-4xl font-bold mt-2">{users?.length || 0}</p>
            </div>
            <FiUsers size={48} className="opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Admin Users</p>
              <p className="text-4xl font-bold mt-2">
                {users?.filter(u => u.role === "admin").length || 0}
              </p>
            </div>
            <FiShield size={48} className="opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Regular Users</p>
              <p className="text-4xl font-bold mt-2">
                {users?.filter(u => u.role === "user").length || 0}
              </p>
            </div>
            <FiUserCheck size={48} className="opacity-50" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-5">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full ring ring-primary ring-offset-2">
                            <img
                              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=29353C&color=fff`}
                              alt={user.name}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">{user.name || "Unnamed User"}</p>
                          <p className="text-xs text-gray-500">ID: {user.uid.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === "admin" ? "badge-success" : "badge-ghost"} badge-lg`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar />
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleRoleMutation.mutate(user.uid)}
                        disabled={toggleRoleMutation.isLoading || user.email === adminUser.email}
                        className={`btn btn-sm ${
                          user.role === "admin"
                            ? "btn-error"
                            : "btn-success"
                        } hover:scale-105 transition`}
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}