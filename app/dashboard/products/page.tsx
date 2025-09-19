"use client";

import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      setProducts([...products, data.data]);
      setFormData({ name: "", description: "", price: "", sku: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Products</h1>

      {/* Create Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            required
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="p-2 border rounded md:col-span-2"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="p-2 border rounded"
            step="0.01"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 md:col-span-2"
          >
            {isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center py-4 text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}