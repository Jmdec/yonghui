"use client";

import { Navigation } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Mail, LogIn } from "lucide-react";

export default function AdminUsersPage() {
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

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joined: "2024-01-15",
      orders: 5,
      spent: 195,
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "2024-02-20",
      orders: 3,
      spent: 105,
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      joined: "2024-03-10",
      orders: 8,
      spent: 420,
      status: "active",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      joined: "2024-04-05",
      orders: 2,
      spent: 78,
      status: "inactive",
    },
  ];

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-background dark:bg-background">
      <Navigation />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="mt-2 text-muted-foreground">
              All registered customers
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border last:border-b-0 hover:bg-muted/50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {u.joined}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">
                        {u.orders}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${u.spent}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            u.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
