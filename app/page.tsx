"use client";

import { Navigation } from "@/components/layout/nav";
import PageBackground from "@/components/home/PageBackground";
import Ticker from "@/components/home/Ticker";
import HeroSection from "@/components/home/HeroSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import EsimFeaturesSection from "@/components/home/EsimFeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyYonghuiSection from "@/components/home/WhyYonghuiSection";
import CtaBanner from "@/components/home/CtaBanner";
import Footer from "@/components/layout/footer";

const Divider = () => (
  <div
    style={{
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(0,212,255,0.18), transparent)",
      position: "relative",
      zIndex: 2,
    }}
  />
);

export default function HomePage() {
  return (
    <main
      style={{
        background: "#060D1A",
        fontFamily: "'DM Sans', sans-serif",
        color: "#E8F4FF",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <PageBackground />
      <Navigation />
      <Ticker />
      <HeroSection />
      <Divider />
      <DestinationsSection />
      <Divider />
      <EsimFeaturesSection />
      <Divider />
      <HowItWorksSection />
      <Divider />
      <WhyYonghuiSection />
      <CtaBanner />
      <Footer />
    </main>
  );
}
