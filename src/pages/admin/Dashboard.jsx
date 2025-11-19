// src/pages/admin/Dashboard.jsx
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const cards = [
    { title: "Total Products", value: stats?.products || 0, icon: FiPackage, color: "bg-blue-600" },
    { title: "Total Orders", value: stats?.orders || 0, icon: FiShoppingBag, color: "bg-green-600" },
    { title: "Pending Orders", value: stats?.pending || 0, icon: FiShoppingBag, color: "bg-orange-600" },
    { title: "Revenue", value: `৳${(stats?.revenue || 0).toLocaleString()}`, icon: FiDollarSign, color: "bg-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome back, Admin!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-full text-white`}>
                <card.icon size={32} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {/* You can map real orders here later */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b">
                <div>
                  <p className="font-medium">#ORD00{i}</p>
                  <p className="text-sm text-gray-500">2 items • ৳1,299</p>
                </div>
                <span className="badge badge-warning">Pending</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Top Products</h2>
          <div className="space-y-3">
            {["Neck Fan Pro", "USB Mini Fan", "Portable Charger"].map((name, i) => (
              <div key={i} className="flex justify-between items-center">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-600">{120 + i * 30} sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;