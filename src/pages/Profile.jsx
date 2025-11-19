// src/pages/Profile.jsx
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();

  const { data: orders } = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!user,
  });

  if (!user) return <div className="text-center py-20">Please login</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center gap-6">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full ring-4 ring-primary"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.display價值 || user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <button onClick={logout} className="btn btn-outline btn-sm mt-4">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {orders?.length === 0 ? (
          <p>No orders yet. <Link to="/" className="link">Start shopping!</Link></p>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order._id} className="border rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">৳{order.totalAmount}</p>
                    <span className={`badge ${
                      order.status === "delivered" ? "badge-success" :
                      order.status === "pending" ? "badge-warning" :
                      order.status === "rejected" ? "badge-error" :
                      "badge-info"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}