// src/components/ProductSkeleton.jsx
import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-64 bg-gray-300 animate-pulse" />
        {/* Tag Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="badge badge-sm bg-gray-400 animate-pulse w-16 h-6 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="card-body p-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-11/12 animate-pulse" />
          <div className="h-5 bg-gray-300 rounded w-9/12 animate-pulse" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
        </div>

        {/* Price & Button */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-8 bg-gray-400 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}