// src/components/Navbar.jsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import Sidebar from "./Sidebar";

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
    toast.success("Logged out successfully!");
    setMobileMenuOpen(false);
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Premium Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-110 transition">
                Laobaan
              </div>
              <div className="hidden sm:block text-xs font-medium text-gray-400 tracking-widest uppercase">
                Premium Store
              </div>
            </Link>

            {/* Desktop Search Bar - Center */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
              <div className="relative w-full group">
                <FiSearch className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition" size={22} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search fans, gadgets, fashion..."
                  className="input input-bordered w-full pl-12 pr-4 py-3 rounded-full border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
                <button
                  onClick={() => handleSearch({ key: "Enter" })}
                  className="absolute right-2 top-1.5 btn btn-primary btn-sm rounded-full px-6 shadow-lg hover:shadow-xl"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden md:flex items-center gap-2 hover:text-primary transition group"
              >
                <div className="relative">
                  <AiOutlineHeart size={26} className="group-hover:fill-primary transition" />
                  <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </Link>

              {/* Cart */}
              <NavLink
                  to="/cart"
                className="relative group"
              >
                <FiShoppingCart size={28} className="group-hover:scale-110 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                    {totalItems}
                  </span>
                )}
              </NavLink>

              {/* User Menu */}
              {user ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="flex items-center gap-3 cursor-pointer group">
                    <div className="avatar online">
                      <div className="w-11 rounded-full ring ring-primary ring-offset-2 ring-offset-white">
                        <img
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=29353C&color=fff`}
                          alt="User"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-800">{user.displayName || "User"}</p>
                      <p className="text-xs text-gray-500">My Account</p>
                    </div>
                  </div>

                  <ul tabIndex={0} className="dropdown-content menu p-4 shadow-2xl bg-white rounded-2xl w-64 mt-3 border border-gray-100">
                    <li className="menu-title text-primary font-bold mb-2">
                      Welcome back!
                    </li>
                    <li><Link to="/profile" className="flex items-center gap-3 py-3 hover:bg-primary/5 rounded-xl"><FiUser /> My Profile</Link></li>
                    <li><Link to="/profile?tab=orders" className="flex items-center gap-3 py-3 hover:bg-primary/5 rounded-xl"><FiShoppingCart /> My Orders</Link></li>
                    <li><Link to="/wishlist" className="flex items-center gap-3 py-3 hover:bg-primary/5 rounded-xl"><FiHeart /> Wishlist</Link></li>
                    <li className="border-t pt-3 mt-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 py-3 text-error hover:bg-error/5 rounded-xl w-full">
                        <FiLogOut /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <FiMenu size={30} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Full-Screen Menu - Modern Style */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 bg-gradient-to-b from-primary to-primary/90 text-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <FiX size={32} />
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
                placeholder="Search anything..."
                className="input w-full rounded-l-full text-gray-800"
              />
              <button
                onClick={() => handleSearch({ key: "Enter" })}
                className="btn bg-white text-primary rounded-r-full -ml-px"
              >
                <FiSearch size={22} />
              </button>
            </div>
          </div>

          {/* User Info */}
          {user ? (
            <div className="bg-white/20 backdrop-blur rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-4">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="User" className="w-16 h-16 rounded-full" />
                <div>
                  <p className="font-bold text-lg">{user.displayName || user.email}</p>
                  <button onClick={handleLogout} className="text-sm opacity-80 hover:opacity-100">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-white text-primary w-full mb-6 rounded-full shadow-lg">
              Login / Register
            </Link>
          )}

          {/* Quick Links */}
          <div className="space-y-1">
            {["Home", "My Profile", "My Orders", "Wishlist"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : item === "My Orders" ? "/profile?tab=orders" : `/${item.toLowerCase().replace(" ", "")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-4 px-6 text-lg font-medium hover:bg-white/10 rounded-xl transition"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-10 border-t border-white/30 pt-6">
            <h3 className="text-lg font-bold mb-4 opacity-90">Shop by Category</h3>
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
}