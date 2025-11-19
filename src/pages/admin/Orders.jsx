// src/pages/admin/Orders.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiPackage, FiSearch, FiFilter } from "react-icons/fi";
import toast from "react-hot-toast";

const statusColors = {
  pending: "badge-warning",
  paid: "badge-info",
  processing: "badge-accent",
  shipped: "badge-primary",
  delivered: "badge-success",
  rejected: "badge-error",
};

const statusOptions = ["pending", "paid", "processing", "shipped", "delivered", "rejected"];

export default function Orders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", filterStatus],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get(`http://localhost:5000/api/orders?status=${filterStatus}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders;
    },
  });

  // Update Order Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const token = await user.getIdToken();
      await axios.put(
        `/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      toast.success("Order status updated!");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filteredOrders = data?.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiPackage size={36} />
          Orders Management
        </h1>

        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, email, name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered pl-10 w-64"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered w-48"
          >
            <option value="all">All Orders</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-primary text-white text-sm">
              <tr>
                <th className="py-4">Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : filteredOrders?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="font-mono text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{order.user.name || "Guest"}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="font-bold text-primary">
                      ৳{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <span className={`badge ${statusColors[order.status]} badge-lg`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        defaultValue={order.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: order._id,
                            status: e.target.value,
                          })
                        }
                        className="select select-sm select-bordered w-36"
                        disabled={updateStatusMutation.isLoading}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {statusOptions.map((status) => (
          <div
            key={status}
            className="bg-white rounded-xl shadow-lg p-5 text-center hover:scale-105 transition"
          >
            <p className="text-gray-600 text-sm capitalize">{status}</p>
            <p className="text-2xl font-bold mt-2">
              {data?.filter((o) => o.status === status).length || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}