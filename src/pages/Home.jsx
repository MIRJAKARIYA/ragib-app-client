// pages/Home.jsx
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import Sidebar from "../components/Sidebar";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
export default function Home() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const search = new URLSearchParams(location.search).get("search") || "";
console.log(category)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,

  } = useInfiniteQuery({
    queryKey: ['products', { category, sort, search }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(`http://localhost:5000/api/products?page=${pageParam}&category=${category}&sort=${sort}&search=${search}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView]);

  const products = data?.pages.flatMap(p => p.products) ?? [];

  return (
    <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <Sidebar active={category} setCategory={setCategory} />
      </aside>

      {/* Main */}
      <div className="lg:col-span-3">
        {/* Sort */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {search ? `Results for "${search}"` : "All Products"}
          </h1>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered w-48"
          >
            <option value="newest">Newest</option>
            <option value="sold">Most Sold</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[1fr]">
          {isLoading && <ProductSkeleton count={12} />}

          {products.map((p, i) => (
            <ProductCard key={p._id + i} product={p} />
          ))}

          {isFetchingNextPage && <ProductSkeleton count={4} />}
        </motion.div>

        {/* Infinite Scroll Trigger */}
        <div ref={ref} className="h-10" />

        {!isLoading && products.length === 0 && (
          <div className="text-center py-20 text-2xl text-gray-500">
            No products found 😔
          </div>
        )}
      </div>
    </div>
  );
}