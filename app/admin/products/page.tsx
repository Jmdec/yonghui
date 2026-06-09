"use client";

import { Navigation } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

export default function AdminProductsPage() {
  const { loading: isLoading, user } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background dark:bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const products = [
    {
      id: 1,
      name: "3GB US Plan",
      destination: "United States",
      price: 19,
      stock: 150,
    },
    {
      id: 2,
      name: "10GB US Plan",
      destination: "United States",
      price: 39,
      stock: 200,
    },
    {
      id: 3,
      name: "3GB UK Plan",
      destination: "United Kingdom",
      price: 17,
      stock: 180,
    },
    {
      id: 4,
      name: "10GB Japan Plan",
      destination: "Japan",
      price: 42,
      stock: 120,
    },
  ];

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-background dark:bg-background">
      <Navigation />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="mt-2 text-muted-foreground">
                Manage all eSIM plans
              </p>
            </div>
            <Button asChild>
              <Link href="#add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Destination
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition"
                    >
                      <td className="px-6 py-4 text-foreground">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {product.destination}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            product.stock > 100
                              ? "bg-green-100 text-green-700"
                              : product.stock > 50
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {product.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="rounded-lg p-2 hover:bg-muted">
                            <Edit2 className="h-4 w-4 text-primary" />
                          </button>
                          <button className="rounded-lg p-2 hover:bg-muted">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
