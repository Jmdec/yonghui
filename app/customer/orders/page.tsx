"use client";

import { Navigation } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const { loading: isLoading, user } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all your eSIM orders
          </p>

          {/* Empty State */}
          <div className="mt-12 rounded-lg border border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              No orders yet
            </h2>
            <p className="mt-2 text-muted-foreground">
              Start by browsing destinations and adding plans to your cart.
            </p>
            <Button asChild className="mt-6">
              <Link href="/destinations">Browse Destinations</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
