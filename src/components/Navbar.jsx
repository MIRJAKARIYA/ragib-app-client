// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../context/AuthContext";
import { FiShoppingCart, Heart, User, Menu, X, Search, LogOut } from "react-icons/fi";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

export default function Navbar() {
  const { items } = useCartStore();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Main Navbar */}
      <div className="navbar bg-primary text-white fixed top-0 z-50 shadow-2xl backdrop-blur-xl bg-opacity-95">
        <div className="max-w-screen-2xl mx-auto w-full px-4">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="text-2xl md:text-3xl font-bold tracking-wider hover:scale-105 transition">
              Laobaan
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="flex w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search fans, chargers, gadgets..."
                className="input input-bordered w-full bg-white/10 backdrop-blur border-white/20 text-white placeholder-white/60 rounded-l-full focus:outline-none"
              />
              <button
                onClick={() => handleSearch({ key: "Enter" })}
                className="btn bg-secondary hover:bg-secondary/90 text-primary rounded-r-full -ml-px border-none"
              >
                <Search size={22} />
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex-none gap-3 md:gap-5">
            {/* Cart */}
            <button
              onClick={() => document.getElementById("cart_drawer").showModal?.() || document.getElementById("cart_drawer").show()}
              className="indicator group"
            >
              <FiShoppingCart size={28} className="group-hover:scale-110 transition" />
              {totalItems > 0 && (
                <span className="badge badge-sm badge-error text-white indicator-item animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:block">
              <Heart size={26} className="hover:fill-red-500 transition" />
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="avatar online">
                  <div className="w-10 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=29353C&color=fff`}
                      alt="User"
                      className="rounded-full"
                    />
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-4 shadow-2xl bg-base-100 rounded-box w-56 mt-3 z-50 text-base-content">
                  <li className="menu-title">
                    <span>Hi, {user.displayName || user.email.split("@")[0]}!</span>
                  </li>
                  <li>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User size={18} /> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile?tab=orders" className="flex items-center gap-2">
                      My Orders
                    </Link>
                  </li>
                  <li className="border-t mt-2 pt-2">
                    <button onClick={handleLogout} className="text-error flex items-center gap-2">
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-circle">
                <User size={26} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div className={`fixed inset-0 bg-black/60 z-50 transition-opacity ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`fixed top-0 left-0 h-full w-80 bg-primary text-white shadow-2xl z-50 transform transition-transform duration-500 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={32} />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mb-6">
            <div className="flex">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search products..."
                className="input w-full bg-white/10 border-white/20 text-white placeholder-white/60 rounded-l-full"
              />
              <button
                onClick={() => handleSearch({ key: "Enter" })}
                className="btn bg-secondary text-primary rounded-r-full -ml-px"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* User Section */}
          {user ? (
            <div className="mb-8 p-4 bg-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}`}
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.displayName || user.email}</p>
                  <button onClick={handleLogout} className="text-sm text-red-300 hover:text-red-200">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary w-full"
              >
                Login / Register
              </Link>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg hover:bg-white/10 rounded-lg px-4">
              Home
            </Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg hover:bg-white/10 rounded-lg px-4">
              My Profile
            </Link>
            <Link to="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg hover:bg-white/10 rounded-lg px-4">
              My Orders
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-lg hover:bg-white/10 rounded-lg px-4">
              Wishlist ❤️
            </Link>
          </div>

          {/* Categories */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 opacity-80">Categories</h3>
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}