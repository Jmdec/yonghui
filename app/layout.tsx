import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LayoutWrapper } from "./layout-wrapper";

export const metadata: Metadata = {
  title: "YH eSIM - Global Connectivity Solutions",
  description:
    "Reliable, affordable eSIM services for travelers worldwide. Stay connected in 190+ destinations with YH.",
  generator: "v0.app",
  metadataBase: new URL("https://yh-esim.com"),
  keywords: ["eSIM", "travel", "connectivity", "roaming", "international"],
  openGraph: {
    title: "YH eSIM - Global Connectivity Solutions",
    description: "Reliable, affordable eSIM services for travelers worldwide.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [{ color: "#060D1A" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "#060D1A" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body
        style={{ margin: 0, background: "#060D1A", minHeight: "100vh" }}
        className="antialiased"
      >
        <LayoutWrapper>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </LayoutWrapper>
      </body>
    </html>
  );
}
