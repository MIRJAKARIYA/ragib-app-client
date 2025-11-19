// src/components/ProductCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";           // Correct
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Heart icons
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(product)
    addItem(product);
    toast.success("Added to cart!", {
      icon: "Cart",
      style: { background: "#29353C", color: "#fff" },
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    toast.success("Added to wishlist!", { icon: "Heart" });
    // Add real wishlist logic later
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ y: -10 }}
      className="card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative"
    >
      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {product.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className={`badge badge-sm text-xs font-bold text-white py-2 px-4 rounded-full shadow-lg animate-pulse ${
                tag === "HOT"
                  ? "bg-red-600"
                  : tag === "NEW"
                  ? "bg-green-600"
                  : tag === "SALE"
                  ? "bg-orange-600"
                  : "bg-purple-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 btn btn-circle btn-sm bg-white/80 backdrop-blur hover:bg-red-500 hover:text-white transition-all group"
      >
        <AiOutlineHeart size={18} className="group-hover:hidden" />
        <AiFillHeart size={18} className="hidden group-hover:block text-white" />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
        <figure className="aspect-square">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x300/DFEBF6/29353C?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition"></div>
        </figure>
      </Link>

      {/* Card Body */}
      <div className="card-body p-4">
        <Link to={`/product/${product._id}`} className="block">
          <h2 className="card-title text-sm font-semibold line-clamp-2 leading-tight hover:text-primary transition">
            {product.title}
          </h2>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 my-2">
          <div className="rating rating-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                name={`rating-${product._id}`}
                className={`mask mask-star-2 ${
                  star <= Math.round(product.rating || 4.5)
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
                checked={star === Math.round(product.rating || 4.5)}
                readOnly
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewsCount || 128})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex justify-between items-end mt-3">
          <div>
         
              <div>
                <p className="text-2xl font-bold text-primary">
                  ৳{product.price.toLocaleString()}
                </p>
          
              </div>
          
   
            <p className="text-xs text-gray-500 mt-1">
              SOLD: {product.sold?.toLocaleString() || "1.2K"}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-circle btn-md shadow-lg hover:scale-110 hover:shadow-xl transition-all"
          >
            <FiShoppingCart size={22} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}