// src/pages/CartPage.jsx
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useCartStore } from "../store/useCartStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();
  console.log(items)

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    // Replace with your actual checkout route
    window.location.href = "/checkout";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FiShoppingBag size={100} className="mx-auto text-gray-300 mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-700 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/" className="btn btn-primary btn-lg rounded-full shadow-lg hover:shadow-xl">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex gap-5">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-28 h-28 object-cover rounded-xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.category}</p>

                    {/* Price */}
                    <div className="mt-3">
                      {item.discountPrice ? (
                        <>
                          <span className="text-2xl font-bold text-primary">
                           ৳{(item.price * item.qty).toLocaleString()}
                          </span>
                     
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          ৳{(item.price * item.qty).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between items-end">
                    {/* Remove */}
                    <button
                      onClick={() => {
                        removeItem(item._id);
                        toast.success("Removed from cart");
                      }}
                      className="text-error hover:bg-error/10 p-2 rounded-lg transition"
                    >
                      <FiTrash2 size={20} />
                    </button>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                      <button
                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                        className="hover:text-primary transition"
                      >
                        <FiMinus size={18} />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, item.qty + 1)}
                        className="hover:text-primary transition"
                      >
                        <FiPlus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold">৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>৳120</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600">-৳0</span>
                </div>

                <div className="border-t-2 border-dashed pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">৳{(totalPrice + 120).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary btn-lg w-full mt-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
              >
                Proceed to Checkout
                <FiArrowRight size={22} />
              </button>

              <div className="mt-6 text-center">
                <Link to="/" className="text-primary hover:underline">
                  ← Continue Shopping
                </Link>
              </div>

              <button
                onClick={clearCart}
                className="btn btn-ghost text-error w-full mt-4"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}