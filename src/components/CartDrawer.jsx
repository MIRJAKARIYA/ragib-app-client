// components/CartDrawer.jsx
import { useCartStore } from "../store/useCartStore";
import { ShoppingCart, X } from "react-icons/fi";

export default function CartDrawer() {
  const { items, removeItem, updateQty } = useCartStore();

  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <div id="cart_drawer" className="drawer drawer-end">
      <input id="cart_drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side z-50">
        <label htmlFor="cart_drawer" className="drawer-overlay"></label>

        <div className="menu p-6 w-96 min-h-full bg-base-100 text-base-content flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Cart ({items.length})</h2>
            <label htmlFor="cart_drawer">
              <X size={28} className="cursor-pointer" />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.map(item => (
              <div key={item._id} className="flex gap-4 mb-4 pb-4 border-b">
                <img src={item.image} alt="" className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                  <p className="text-lg">৳{item.price * item.qty}</p>
                  <div className="join mt-2">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      className="join-item btn btn-xs"
                    >−</button>
                    <div className="join-item btn btn-xs">{item.qty}</div>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      className="join-item btn btn-xs"
                    >+</button>
                  </div>
                </div>

                <button onClick={() => removeItem(item._id)}>
                  <X />
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xl font-bold mb-4">Total: ৳{total.toLocaleString()}</div>

            <button className="btn btn-primary w-full btn-lg rounded-xl">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}