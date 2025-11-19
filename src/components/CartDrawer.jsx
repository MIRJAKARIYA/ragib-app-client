// src/components/CartDrawer.jsx
import { useCartStore } from "../store/useCartStore";
import { FiShoppingCart, FiX } from "react-icons/fi"; // Fixed: use FiShoppingCart & FiX

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* DaisyUI Drawer */}
      <div className="drawer drawer-end z-50">
        <input id="cart_drawer" type="checkbox" className="drawer-toggle" />

        {/* Main Content (clicking outside closes) */}
        <div className="drawer-side">
          <label htmlFor="cart_drawer" aria-label="close sidebar" className="drawer-overlay"></label>

          <div className="bg-base-100 text-base-content min-h-full w-96 p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FiShoppingCart size={28} />
                Your Cart ({totalItems})
              </h2>
              <label htmlFor="cart_drawer" className="cursor-pointer hover:bg-base-300 rounded-full p-2 transition">
                <FiX size={28} />
              </label>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <FiShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-xl text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-base-200 rounded-xl p-4 hover:bg-base-300 transition">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-lg font-bold text-primary mt-1">
                        ৳{(item.price * item.qty).toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          className="btn btn-xs btn-circle btn-outline"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          className="btn btn-xs btn-circle btn-primary"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-error hover:bg-error/10 rounded-full p-2 transition"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer - Total & Checkout */}
            {items.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">৳{total.toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  <button className="btn btn-primary btn-lg w-full rounded-xl text-lg">
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="btn btn-ghost w-full text-error"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}