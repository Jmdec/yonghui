"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Download,
  Settings,
  LogOut,
  Phone,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Dashboard
              </h1>
              <p className="text-blue-300">
                Manage your eSIM plans and account
              </p>
            </div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-blue-500/30 text-blue-300 hover:bg-blue-950/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {/* Active Plans */}
            <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-cyan-950/30">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Active Plans</h3>
              </div>
              <p className="text-3xl font-bold text-cyan-400 mb-2">2</p>
              <p className="text-sm text-blue-300">Japan & United States</p>
            </div>

            {/* Data Used */}
            <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-cyan-950/30">
              <div className="flex items-center gap-3 mb-4">
                <Download className="h-6 w-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Data Used</h3>
              </div>
              <p className="text-3xl font-bold text-cyan-400 mb-2">4.2 GB</p>
              <p className="text-sm text-blue-300">of 10 GB available</p>
            </div>

            {/* Account Balance */}
            <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-cyan-950/30">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Account Balance</h3>
              </div>
              <p className="text-3xl font-bold text-cyan-400 mb-2">$45.50</p>
              <p className="text-sm text-blue-300">Add funds anytime</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-cyan-950/30">
            <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  destination: "Japan",
                  plan: "5GB/7 days",
                  price: "$12.99",
                  date: "2024-01-15",
                  status: "Active",
                },
                {
                  id: 2,
                  destination: "United States",
                  plan: "3GB/7 days",
                  price: "$9.99",
                  date: "2024-01-08",
                  status: "Expired",
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-4 rounded-lg bg-blue-950/30 border border-blue-500/10"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {order.destination}
                    </p>
                    <p className="text-sm text-blue-300">{order.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">{order.price}</p>
                    <p
                      className={`text-xs ${order.status === "Active" ? "text-green-400" : "text-red-400"}`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 font-semibold"
            >
              <Link href="/destinations">Buy More Plans</Link>
            </Button>
            <Button
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-blue-950/50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
