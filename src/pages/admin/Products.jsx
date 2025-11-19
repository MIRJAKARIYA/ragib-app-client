// src/pages/admin/Products.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiPackage, FiPlus, FiEdit, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const categories = [
  "Bags", "Shoes", "Jewelry", "Beauty Products", "Mens Clothing", "Womens Clothing",
  "Baby Items", "Eyewear", "Office & School Supplies", "Seasonal Products",
  "Phone Accessories", "Sports & Fitness", "Entertainment Items", "Watches", "Fans"
];

export default function Products() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    title: "", price: "", discountPrice: "", image: "", category: "", tags: "", sold: 0, rating: 4.5
  });

  // Fetch Products
  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.products || res.data;
    },
  });

  // Save (Create/Update) Product
  const saveProductMutation = useMutation({
    mutationFn: async (product) => {
      const token = await user.getIdToken();
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, product, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/products", product, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(editingProduct ? "Product updated!" : "Product added!");
      setShowForm(false);
      setEditingProduct(null);
      setForm({ title: "", price: "", discountPrice: "", image: "", category: "", tags: "", sold: 0, rating: 4.5 });
    },
    onError: () => toast.error("Failed to save product"),
  });

  // Delete Product
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted!");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }

    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      sold: Number(form.sold) || 0,
      rating: Number(form.rating) || 4.5,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };

    saveProductMutation.mutate(productData);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      price: product.price,
      discountPrice: product.discountPrice || "",
      image: product.image,
      category: product.category,
      tags: product.tags?.join(", ") || "",
      sold: product.sold || 0,
      rating: product.rating || 4.5,
    });
    setShowForm(true);
  };

  const filteredProducts = products?.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <FiPackage size={40} />
          Products Management
        </h1>

        <div className="flex gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered pl-10 w-64"
            />
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setForm({ title: "", price: "", discountPrice: "", image: "", category: "", tags: "", sold: 0, rating: 4.5 });
              setShowForm(true);
            }}
            className="btn btn-success hover:scale-105 transition"
          >
            <FiPlus size={20} /> Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-blue-100">Total</p>
          <p className="text-4xl font-bold mt-2">{products?.length || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-green-100">In Stock</p>
          <p className="text-4xl font-bold mt-2">{products?.length || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-orange-100">Top Sold</p>
          <p className="text-3xl font-bold mt-2">
            {products?.sort((a, b) => (b.sold || 0) - (a.sold || 0))[0]?.sold || 0}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 rounded-2xl shadow-xl">
          <p className="text-purple-100">Categories</p>
          <p className="text-4xl font-bold mt-2">
            {new Set(products?.map(p => p.category)).size || 0}
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 btn btn-circle btn-ghost"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Product Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input input-bordered w-full"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input input-bordered"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount Price (optional)"
                  value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <input
                type="url"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="input input-bordered w-full"
                required
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Tags (e.g. HOT, NEW, SALE)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input input-bordered w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Sold Count"
                  value={form.sold}
                  onChange={(e) => setForm({ ...form, sold: e.target.value })}
                  className="input input-bordered"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Rating"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="input input-bordered"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saveProductMutation.isLoading}
                  className="btn btn-success flex-1"
                >
                  {saveProductMutation.isLoading ? "Saving..." : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
              <div className="h-56 bg-gray-300 rounded-t-2xl"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          ))
        ) : filteredProducts?.length === 0 ? (
          <p className="col-span-full text-center text-2xl text-gray-500 py-20">
            No products found
          </p>
        ) : (
          filteredProducts?.map(product => (
            <div key={product._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-56 object-cover"
                />
                {product.tags?.[0] && (
                  <span className="absolute top-3 left-3 badge badge-error text-white font-bold">
                    {product.tags[0]}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg line-clamp-2">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ৳{product.discountPrice || product.price}
                    </p>
                    {product.discountPrice && (
                      <del className="text-sm text-gray-400">৳{product.price}</del>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-sm btn-circle btn-warning"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(product._id)}
                      className="btn btn-sm btn-circle btn-error"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-3">
                  <span>Sold: {product.sold || 0}</span>
                  <span>★ {product.rating || 4.5}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}