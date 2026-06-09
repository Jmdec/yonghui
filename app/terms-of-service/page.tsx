"use client";

import { Navigation } from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { useEffect, useRef, useState } from "react";

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
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          "linear-gradient(160deg,#dff2ff 0%,#c8e8ff 35%,#b0d8ff 65%,#c4eeff 100%)",
      }}
    >
      <style>{`
        @keyframes float-blob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      `}</style>
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
          height: 600,
          background:
            "radial-gradient(ellipse,rgba(0,160,255,0.16) 0%,transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: -100,
          width: 500,
          height: 500,
          background:
            "radial-gradient(ellipse,rgba(0,120,255,0.09) 0%,transparent 70%)",
          animation: "float-blob 8s ease-in-out infinite",
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
          <pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#0080FF"
              strokeWidth="0.4"
              opacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
      </svg>
    </div>
  );
}

const sections = [
  {
    icon: "📋",
    title: "Acceptance of Terms",
    content: `By accessing or using the YH eSIM platform, website, or any related services ("Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our Service.

These Terms apply to all visitors, customers, and others who access or use the Service. We reserve the right to update these Terms at any time, with notice provided via email or site banner.`,
  },
  {
    icon: "📡",
    title: "The Service",
    content: `YH provides digital eSIM plans that allow users to access mobile data in supported countries without a physical SIM card. Our Service includes the purchase, delivery, and support of eSIM profiles compatible with unlocked, eSIM-capable devices.

Network coverage, speeds, and availability depend on local carrier partners and may vary by location. We do not guarantee uninterrupted connectivity, and network outages outside our control are not grounds for refund unless the plan is entirely unusable.`,
  },
  {
    icon: "🛒",
    title: "Orders and Payment",
    content: `All purchases are subject to acceptance by YH. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud.

Prices are listed in USD unless otherwise stated and are inclusive of applicable fees. Payments are processed by our third-party payment partners using secure, PCI-compliant systems. By placing an order, you authorise us to charge your selected payment method.`,
  },
  {
    icon: "🔁",
    title: "Refunds and Cancellations",
    content: `Unused eSIM plans are eligible for a full refund within 30 days of purchase, provided the QR code has not been scanned or the plan activated. Once an eSIM has been installed and activated on a device, it is considered used and is non-refundable, except where the plan failed to function due to a fault on our side.

To request a refund, contact support@YH.com with your order reference. Approved refunds are processed within 5–10 business days to your original payment method.`,
  },
  {
    icon: "👤",
    title: "Accounts and Eligibility",
    content: `You must be at least 18 years old to create an account and purchase from YH. By using the Service, you represent that you meet this requirement.

You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately at security@YH.com if you suspect unauthorised access.`,
  },
  {
    icon: "🚫",
    title: "Prohibited Use",
    content: `You agree not to use the Service to:

• Resell or redistribute eSIM plans without written permission from YH
• Circumvent any technical restrictions or security measures
• Engage in fraudulent transactions or chargebacks without valid grounds
• Use the Service in a way that violates any applicable law or regulation
• Interfere with or disrupt the integrity of the platform

Violations may result in immediate account suspension and, where applicable, legal action.`,
  },
  {
    icon: "⚠️",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, YH and its affiliates, directors, and employees shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.

Our total aggregate liability for any claim related to the Service shall not exceed the amount you paid for the specific plan giving rise to the claim.`,
  },
  {
    icon: "🌐",
    title: "Governing Law",
    content: `These Terms are governed by the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through the courts of Makati City, Metro Manila, unless otherwise agreed in writing.

If any provision of these Terms is found unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    icon: "📩",
    title: "Contact",
    content: `For questions about these Terms, contact us at legal@YH.com or by mail:

YH eSIM
Manila, Philippines
Southeast Asia HQ`,
  },
];

function PolicySection({
  icon,
  title,
  content,
  index,
}: {
  icon: string;
  title: string;
  content: string;
  index: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.68)",
        border: "1px solid rgba(0,140,255,0.16)",
        borderRadius: 16,
        padding: "24px 26px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 16px rgba(0,80,200,0.07)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: "linear-gradient(180deg,#0072FF,#00C8FF)",
          borderRadius: "16px 0 0 16px",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            flexShrink: 0,
            background: "rgba(0,114,255,0.08)",
            border: "1px solid rgba(0,114,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 800,
            color: "#002f6c",
            fontSize: "1.05rem",
            margin: 0,
            lineHeight: 1.3,
            paddingTop: 8,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: 54 }}>
        {content.split("\n\n").map((para, i) => (
          <p
            key={i}
            style={{
              color: "#3d6090",
              fontSize: "0.88rem",
              lineHeight: 1.8,
              margin: i < content.split("\n\n").length - 1 ? "0 0 12px" : 0,
              whiteSpace: "pre-line",
            }}
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function TermsOfServicePage() {
  const { ref: heroRef, visible: heroVis } = useFadeIn();

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background =
      "linear-gradient(160deg,#dff2ff 0%,#c8e8ff 35%,#b0d8ff 65%,#c4eeff 100%)";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  return (
    <main
      style={{
        background: "transparent",
        fontFamily: "'DM Sans',sans-serif",
        color: "#002f6c",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>

      <Background />
      <Navigation />

      {/* Hero */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 780,
          margin: "0 auto",
          padding: "52px 28px 40px",
          opacity: heroVis ? 1 : 0,
          transform: heroVis ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,144,255,0.1)",
            border: "1px solid rgba(0,144,255,0.28)",
            borderRadius: 999,
            padding: "5px 18px",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#0090FF",
              boxShadow: "0 0 8px #0090FF",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color: "#0055cc",
              fontWeight: 700,
            }}
          >
            Legal
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "clamp(2rem,4vw,2.8rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#002f6c",
            margin: "0 0 14px",
            letterSpacing: "-0.025em",
          }}
        >
          Terms of{" "}
          <span
            style={{
              color: "#0072FF",
              position: "relative",
              display: "inline-block",
            }}
          >
            Service
            <span
              style={{
                position: "absolute",
                bottom: -3,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg,#0072FF,#00C8FF)",
                borderRadius: 2,
              }}
            />
          </span>
        </h1>

        <p
          style={{
            color: "#4a7ea0",
            fontSize: "1rem",
            lineHeight: 1.7,
            margin: "0 0 10px",
            maxWidth: 560,
          }}
        >
          Please read these terms carefully before using YH eSIM. They
          govern your relationship with us and describe your rights and
          obligations.
        </p>
        <p style={{ color: "#8ab8d0", fontSize: "0.8rem", margin: 0 }}>
          Last updated: <strong>June 9, 2025</strong> · Questions? Email{" "}
          <a
            href="mailto:legal@YH.com"
            style={{ color: "#0072FF", textDecoration: "none" }}
          >
            legal@YH.com
          </a>
        </p>
      </div>

      {/* Sections */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 780,
          margin: "0 auto",
          padding: "0 28px 72px",
          display: "flex",
          flexDirection: "column" as const,
          gap: 14,
        }}
      >
        {sections.map((s, i) => (
          <PolicySection key={s.title} {...s} index={i} />
        ))}

        {/* CTA blurb */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(0,85,255,0.08),rgba(0,184,255,0.08))",
            border: "1px solid rgba(0,114,255,0.2)",
            borderRadius: 16,
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              flexShrink: 0,
              background: "linear-gradient(135deg,#0055ff,#00b8ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              boxShadow: "0 4px 14px rgba(0,85,255,0.25)",
            }}
          >
            ⚖️
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#002f6c",
                fontSize: "0.9rem",
                marginBottom: 2,
              }}
            >
              Questions about these terms?
            </div>
            <div style={{ color: "#4a7ea0", fontSize: "0.83rem" }}>
              Our legal team is reachable at{" "}
              <a
                href="mailto:legal@YH.com"
                style={{
                  color: "#0072FF",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                legal@YH.com
              </a>
              . We aim to respond within 2 business days.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(180,220,255,0.5)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,140,255,0.18)",
        }}
      >
        <style>{`footer[style]{background:transparent!important;border-top:none!important}footer p{color:#2a5a8a!important}footer h4{color:#002f6c!important}`}</style>
        <Footer />
      </div>
    </main>
  );
}
