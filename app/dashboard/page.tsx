"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error("Logout failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to log out.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700">
            Management Links
          </h2>
          <div className="mt-4">
            {/* <Link
              href="/dashboard/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Manage Products
            </Link> */}
            <Link
              href="/dashboard/generator"
              className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 ml-4"
            >
              Generate Document
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
