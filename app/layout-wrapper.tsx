"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { ChatWidget } from "@/components/chat/chat-widget";
import { PageLoader } from "@/components/ui/page-loader";
import { ReactNode } from "react";
import { SocialFloat } from "@/components/SocialFloat";
export function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <PageLoader />
        {children}
        <ChatWidget />
        <SocialFloat />
      </CartProvider>
    </AuthProvider>
  );
}
