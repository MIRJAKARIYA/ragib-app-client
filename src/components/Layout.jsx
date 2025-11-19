// components/Layout.jsx
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import { Outlet } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Layout() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen pt-20 pb-32"
      >
        <Outlet />
      </motion.div>
    </>
  );
}