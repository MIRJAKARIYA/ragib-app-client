// src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { FiPackage, FiUsers, FiShoppingBag, FiHome, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { to: "/admin", icon: FiHome, label: "Dashboard" },
    { to: "/admin/products", icon: FiPackage, label: "Products" },
    { to: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
    { to: "/admin/users", icon: FiUsers, label: "Users" },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white shadow-2xl">
        <div className="p-6">
          <h1 className="text-3xl font-bold tracking-wider">Laobaan</h1>
          <p className="text-sm opacity-80 mt-1">Admin Panel</p>
        </div>

        <nav className="mt-10">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 text-lg font-medium transition-all ${
                  isActive
                    ? "bg-white text-primary shadow-lg"
                    : "hover:bg-white/10"
                }`
              }
            >
              <item.icon size={24} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-secondary">
                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=Admin`} />
              </div>
            </div>
            <div>
              <p className="font-semibold">{user?.displayName || "Admin"}</p>
              <p className="text-xs opacity-80">admin@laobaan.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm w-full"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;