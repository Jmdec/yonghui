"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const Divider = () => (
  <div
    style={{
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(0,140,255,0.35), transparent)",
      position: "relative",
      zIndex: 2,
    }}
  />
);

function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #dff2ff 0%, #c8e8ff 30%, #b0d8ff 60%, #c4eeff 100%)",
      }}
    >
      <style>{`
        @keyframes pulse-node { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.5)} }
        @keyframes data-flow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
        @keyframes float-blob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
        @keyframes scan-line { 0%{top:-4px} 100%{top:100%} }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 650,
          background:
            "radial-gradient(ellipse, rgba(0,160,255,0.2) 0%, transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: -80,
          width: 520,
          height: 520,
          background:
            "radial-gradient(ellipse, rgba(0,120,255,0.12) 0%, transparent 70%)",
          animation: "float-blob 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: -80,
          width: 480,
          height: 420,
          background:
            "radial-gradient(ellipse, rgba(0,200,255,0.14) 0%, transparent 70%)",
          animation: "float-blob 9s ease-in-out infinite 2s",
        }}
      />
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#0080FF"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {[
          "M 80 120 L 80 220 L 200 220 L 200 320",
          "M 300 80 L 420 80 L 420 180 L 560 180",
          "M 700 200 L 700 340 L 820 340",
          "M 900 100 L 1020 100 L 1020 260 L 1160 260",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#0072FF"
            strokeWidth="1.2"
            opacity="0.13"
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{
              animation: `data-flow ${2.5 + i * 0.4}s linear infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(0,180,255,0.25), transparent)",
          animation: "scan-line 6s linear infinite",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "110px 24px 80px",
        textAlign: "center",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      <style>{`
        @keyframes hero-in { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes eyebrow-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,144,255,0.3)} 50%{box-shadow:0 0 0 8px rgba(0,144,255,0)} }
        @keyframes btn-glow { 0%,100%{box-shadow:0 8px 28px rgba(0,114,255,0.35)} 50%{box-shadow:0 8px 44px rgba(0,180,255,0.55)} }
      `}</style>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,144,255,0.1)",
          border: "1px solid rgba(0,144,255,0.3)",
          borderRadius: 999,
          padding: "7px 22px",
          marginBottom: 36,
          animation: "eyebrow-pulse 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#0090FF",
            display: "inline-block",
            boxShadow: "0 0 10px #0090FF",
            animation: "pulse-node 1.5s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#0055cc",
            fontWeight: 700,
          }}
        >
          About YH ESIM
        </span>
      </div>
      <h1
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
          fontWeight: 800,
          lineHeight: 1.08,
          color: "#002f6c",
          margin: "0 0 24px",
          letterSpacing: "-0.025em",
          animation: "hero-in 0.7s ease both 0.1s",
        }}
      >
        Connecting the World,{" "}
        <span
          style={{
            color: "#0072FF",
            position: "relative",
            display: "inline-block",
          }}
        >
          One eSIM at a Time
          <span
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              right: 0,
              height: 3,
              background: "linear-gradient(90deg, #0072FF, #00C8FF)",
              borderRadius: 2,
            }}
          />
        </span>
      </h1>
      <p
        style={{
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          color: "#2e6a96",
          lineHeight: 1.8,
          maxWidth: 580,
          margin: "0 auto 48px",
          animation: "hero-in 0.7s ease both 0.25s",
        }}
      >
        YH ESIM was founded with a single mission — make global connectivity
        effortless, affordable, and instant for every traveler on the planet.
      </p>
      <Link
        href="/destinations"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, #0055ff, #00b8ff)",
          color: "#fff",
          padding: "16px 40px",
          borderRadius: 14,
          fontSize: "1rem",
          fontWeight: 700,
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          animation: "btn-glow 3s ease-in-out infinite",
        }}
      >
        Browse eSIM Plans →
      </Link>
    </section>
  );
}

function Mission() {
  const { ref, visible } = useFadeIn();
  const cards = [
    {
      icon: "🌏",
      title: "Our Mission",
      desc: "To eliminate the friction of international travel by providing instant, reliable, and affordable eSIM connectivity to travelers in 200+ countries.",
    },
    {
      icon: "👁️",
      title: "Our Vision",
      desc: "A world where staying connected while traveling is as simple as boarding a plane — no SIM swaps, no roaming surprises, no borders.",
    },
    {
      icon: "💙",
      title: "Our Values",
      desc: "We believe in transparency, simplicity, and putting travelers first. Every product decision we make starts with the question: does this make travel easier?",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {cards.map((c, i) => (
          <div
            key={c.title}
            style={{
              background: "rgba(255,255,255,0.68)",
              border: "1px solid rgba(0,140,255,0.2)",
              borderRadius: 22,
              padding: "40px 32px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,80,200,0.08)",
              position: "relative",
              overflow: "hidden",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, hsl(${210 + i * 15},100%,50%), hsl(${220 + i * 15},100%,65%))`,
                borderRadius: "22px 22px 0 0",
              }}
            />
            <div style={{ fontSize: "2.4rem", marginBottom: 18 }}>{c.icon}</div>
            <h3
              style={{
                color: "#002f6c",
                fontWeight: 700,
                fontSize: "1.15rem",
                marginBottom: 12,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                color: "#3d6e90",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Story() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              color: "#0072FF",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Our Story
          </div>
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              color: "#002f6c",
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            Born from a traveler's frustration
          </h2>
          <p
            style={{
              color: "#3d6e90",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Our founders were frequent travelers who grew tired of hunting for
            local SIM cards at every airport, overpaying for roaming plans, and
            losing precious travel time dealing with connectivity issues.
          </p>
          <p
            style={{
              color: "#3d6e90",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            When eSIM technology matured, they saw an opportunity — build a
            platform that makes buying a travel data plan as easy as ordering
            food online. No store visits, no physical cards, no waiting.
          </p>
          <p style={{ color: "#3d6e90", fontSize: "0.95rem", lineHeight: 1.8 }}>
            Today, YH ESIM serves thousands of travelers across Southeast Asia
            and beyond, with plans covering 200+ countries and partnerships with
            top-tier global carriers.
          </p>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {[
            { value: "200+", label: "Countries Covered" },
            { value: "10K+", label: "Happy Travelers" },
            { value: "99.9%", label: "Uptime" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(0,140,255,0.22)",
                borderRadius: 18,
                padding: "28px 20px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,80,200,0.08)",
                position: "relative",
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transform: visible ? "scale(1)" : "scale(0.92)",
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, #0072FF, #00C8FF)",
                  borderRadius: "18px 18px 0 0",
                }}
              />
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#0055cc",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#4a85b0",
                  marginTop: 6,
                  letterSpacing: "0.07em",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyYonghui() {
  const { ref, visible } = useFadeIn();
  const reasons = [
    {
      icon: "⚡",
      title: "Instant Activation",
      desc: "Get connected in under 3 minutes from purchase. No shipping, no waiting, no store visits.",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      desc: "No hidden fees, no surprise roaming charges. What you see is what you pay.",
    },
    {
      icon: "🌐",
      title: "Global Coverage",
      desc: "Plans for 200+ countries with partnerships across the world's leading carriers.",
    },
    {
      icon: "🔒",
      title: "Secure & Reliable",
      desc: "Enterprise-grade security with 99.9% uptime. Your data and identity are always protected.",
    },
    {
      icon: "💬",
      title: "24/7 Support",
      desc: "Real humans available around the clock to help you get and stay connected wherever you are.",
    },
    {
      icon: "♻️",
      title: "Eco-Friendly",
      desc: "No plastic SIM cards, no packaging waste. eSIM is the sustainable choice for modern travelers.",
    },
  ];
  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        zIndex: 2,
        padding: "80px 24px",
        maxWidth: 1060,
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <h2
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
          fontWeight: 800,
          color: "#002f6c",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Why Choose YH?
      </h2>
      <p
        style={{
          color: "#4a85b0",
          textAlign: "center",
          marginBottom: 52,
          fontSize: "0.97rem",
        }}
      >
        Everything you need, nothing you don't
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 18,
        }}
      >
        {reasons.map((r, i) => (
          <div
            key={r.title}
            style={{
              display: "flex",
              gap: 18,
              background: "rgba(255,255,255,0.62)",
              border: "1px solid rgba(0,140,255,0.16)",
              borderRadius: 16,
              padding: "22px 24px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 14px rgba(0,80,200,0.06)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-16px)",
              transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            }}
          >
            <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{r.icon}</span>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: "#002f6c",
                  fontSize: "0.95rem",
                  marginBottom: 5,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  color: "#3d6e90",
                  fontSize: "0.83rem",
                  lineHeight: 1.65,
                }}
              >
                {r.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "72px 24px 88px",
        margin: "0 auto",
        maxWidth: 900,
      }}
    >
      <style>{`@keyframes btn-glow { 0%,100%{box-shadow:0 8px 28px rgba(0,114,255,0.35)} 50%{box-shadow:0 8px 44px rgba(0,180,255,0.55)} }`}</style>
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(0,100,255,0.12), rgba(0,190,255,0.1))",
          border: "1px solid rgba(0,150,255,0.3)",
          borderRadius: 26,
          padding: "64px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 14px 60px rgba(0,100,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 350,
            background:
              "radial-gradient(ellipse, rgba(0,150,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            color: "#002060",
            marginBottom: 14,
          }}
        >
          Ready to travel smarter?
        </h2>
        <p
          style={{
            color: "#2e6a96",
            fontSize: "1rem",
            marginBottom: 36,
            maxWidth: 480,
            margin: "0 auto 36px",
            lineHeight: 1.7,
          }}
        >
          Join thousands of travelers who trust YH for seamless global
          connectivity.
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap" as const,
          }}
        >
          <Link
            href="/destinations"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "linear-gradient(135deg, #0055ff, #00b8ff)",
              color: "#fff",
              padding: "16px 40px",
              borderRadius: 14,
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              animation: "btn-glow 3s ease-in-out infinite",
            }}
          >
            Browse Plans →
          </Link>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.7)",
              color: "#0055cc",
              padding: "16px 40px",
              borderRadius: 14,
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(0,140,255,0.3)",
            }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(160deg, #dff2ff 0%, #c8e8ff 30%, #b0d8ff 60%, #c4eeff 100%)";
    return () => {
      document.body.style.background = prev;
    };
  }, []);
  return (
    <main
      style={{
        background: "transparent",
        fontFamily: "'DM Sans', sans-serif",
        color: "#002f6c",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <Background />
      <Navigation />
      <Hero />
      <Divider />
      <Mission />
      <Divider />
      <Story />
      <Divider />
      <WhyYonghui />
      <CtaBanner />
      <Footer />
    </main>
  );
}
