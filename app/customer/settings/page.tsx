"use client";

import { Navigation } from "@/components/layout/nav";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { loading: isLoading, user, logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-foreground">
            Account Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile and preferences
          </p>

          {/* Profile Section */}
          <div className="mt-12 rounded-lg border border-border bg-card p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Profile Information
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <p className="mt-2 rounded-lg border border-input bg-background px-4 py-2 text-foreground">
                  {user?.name || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <p className="mt-2 rounded-lg border border-input bg-background px-4 py-2 text-foreground">
                  {user?.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Account Type
                </label>
                <p className="mt-2 rounded-lg border border-input bg-background px-4 py-2 text-foreground capitalize">
                  {user?.role === "admin" ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-12 rounded-lg border border-destructive/20 bg-destructive/5 p-8">
            <h2 className="text-xl font-semibold text-foreground">
              Danger Zone
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Once you log out, you&apos;ll need to sign in again to access your
              account.
            </p>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="mt-6"
            >
              Log Out
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
