// src/pages/ProductDetail.jsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import toast from "react-hot-toast";
import { useCartStore } from "../store/useCartStore";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      return res.data.product
;
    },
  });
  console.log(product)

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${quantity} × ${product.title} added to cart!`, {
      icon: "Cart",
      style: { background: "#29353C", color: "#fff" },
    });
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Please login to save to wishlist");
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      { icon: "Heart" }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-6">
        <h1 className="text-4xl font-bold text-gray-400">Product Not Found</h1>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
      </div>
    );
  }

  // Use single main image or fallback
  const mainImage = product.image || "https://via.placeholder.com/600";

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-contain p-8"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 btn btn-circle btn-lg bg-white/90 hover:bg-red-500 hover:text-white shadow-xl transition-all"
              >
                {isWishlisted ? (
                  <AiFillHeart size={26} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={26} />
                )}
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`badge badge-lg font-bold text-white py-3 px-6 rounded-full shadow-lg animate-pulse ${
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

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {product.title}
            </h1>

            {/* Rating & Sold */}
            <div className="flex items-center gap-4 text-lg">
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    className={`mask mask-star-2 ${
                      star <= Math.round(product.rating || 4.5)
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                    readOnly
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating || 4.8}</span>
              <span className="text-gray-500">• {product.sold || "1.5K"} sold</span>
            </div>

            {/* Price */}
            <div className="space-y-3">
              {product.discountPrice ? (
                <>
                  <div className="flex items-end gap-4">
                    <p className="text-5xl font-bold text-primary">
                      ৳{product.discountPrice}
                    </p>
                    <del className="text-3xl text-gray-400">
                      ৳{product.price}
                    </del>
                  </div>
                  <span className="badge badge-error badge-lg text-lg px-4 py-3">
                    Save ৳{product.price - product.discountPrice}
                  </span>
                </>
              ) : (
                <p className="text-5xl font-bold text-primary">
                  ৳{product.price}
                </p>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-6">
              <div className="flex items-center border-2 border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-ghost btn-circle text-xl"
                >
                  −
                </button>
                <span className="w-20 text-center text-2xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-ghost btn-circle text-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg flex-1 text-lg rounded-xl shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all"
              >
                <FiShoppingCart size={26} className="mr-2" />
                Add to Cart
              </button>

              <button className="btn btn-outline btn-circle btn-lg">
                <FiShare2 size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y-2">
              {[
                { icon: FiTruck, title: "Free Delivery", desc: "Inside Dhaka" },
                { icon: FiShield, title: "100% Original", desc: "Guaranteed" },
                { icon: FiRefreshCw, title: "7 Days Return", desc: "Easy Policy" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon size={40} className="mx-auto mb-3 text-primary" />
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            <div>
              <span className="text-gray-600 font-medium">Category: </span>
              <Link
                to={`/?category=${encodeURIComponent(product.category)}`}
                className="badge badge-primary badge-lg hover:badge-secondary transition"
              >
                {product.category}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6">Product Description</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {product.description ||
              "Premium quality product with excellent build and performance. Comes with original accessories and warranty. Perfect for daily use."}
          </p>
        </div>
      </div>
    </div>
  );
}