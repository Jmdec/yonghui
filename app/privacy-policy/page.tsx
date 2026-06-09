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
        @keyframes data-flow { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
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
    icon: "🧾",
    title: "Information We Collect",
    content: `We collect information you provide directly when purchasing an eSIM plan, contacting support, or creating an account. This includes your name, email address, phone number, and payment information (processed securely through our payment partners — we never store raw card details).

We also collect usage data automatically: device type, IP address, browsing behaviour on our site, and eSIM activation status. This helps us improve our service and resolve technical issues quickly.`,
  },
  {
    icon: "🔍",
    title: "How We Use Your Information",
    content: `Your data is used solely to deliver and improve the YH eSIM service. Specifically:

• Fulfil your order and deliver your eSIM QR code
• Provide customer support and resolve activation issues
• Send transactional emails (order confirmations, receipts)
• Detect and prevent fraud or unauthorised access
• Improve our platform through anonymised analytics

We do not sell, rent, or trade your personal data to third parties for marketing purposes.`,
  },
  {
    icon: "🤝",
    title: "Data Sharing",
    content: `We share your information only with trusted service providers who help us operate the platform — including cloud infrastructure providers, payment processors, and telecom network partners required to activate your eSIM. All third parties are contractually obligated to protect your data and use it only as instructed.

We may disclose information if required by law or to protect the rights and safety of our users.`,
  },
  {
    icon: "🔐",
    title: "Data Security",
    content: `We take security seriously. All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. Access to production systems is restricted to authorised personnel only, with multi-factor authentication enforced across all admin accounts.

Despite these measures, no system is completely immune to risk. If you suspect unauthorised access to your account, contact us immediately at security@YH.com.`,
  },
  {
    icon: "📅",
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services. After account closure, we keep records for up to 7 years to comply with tax and legal obligations, then securely delete them.

Anonymised analytics data may be retained indefinitely as it cannot be linked back to you.`,
  },
  {
    icon: "⚖️",
    title: "Your Rights",
    content: `Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal data. You may also object to or restrict certain processing.

To exercise any of these rights, email privacy@YH.com with your request. We will respond within 30 days. If you are located in the EEA or UK, you may also lodge a complaint with your local data protection authority.`,
  },
  {
    icon: "🍪",
    title: "Cookies",
    content: `We use cookies and similar tracking technologies to operate and improve our site. For full details on what cookies we use and how to manage them, please see our Cookie Policy.`,
  },
  {
    icon: "🔄",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, for material changes, notify you by email or via a banner on our site. Continued use of YH after changes take effect constitutes acceptance of the updated policy.`,
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

export default function PrivacyPolicyPage() {
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
          Privacy{" "}
          <span
            style={{
              color: "#0072FF",
              position: "relative",
              display: "inline-block",
            }}
          >
            Policy
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
          YH eSIM is committed to protecting your personal data. This
          policy explains what we collect, how we use it, and your rights.
        </p>
        <p style={{ color: "#8ab8d0", fontSize: "0.8rem", margin: 0 }}>
          Last updated: <strong>June 9, 2025</strong> · Questions? Email{" "}
          <a
            href="mailto:privacy@YH.com"
            style={{ color: "#0072FF", textDecoration: "none" }}
          >
            privacy@YH.com
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

        {/* Contact blurb */}
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
            📬
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
              Still have questions about your data?
            </div>
            <div style={{ color: "#4a7ea0", fontSize: "0.83rem" }}>
              Reach our privacy team at{" "}
              <a
                href="mailto:privacy@YH.com"
                style={{
                  color: "#0072FF",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                privacy@YH.com
              </a>{" "}
              — we respond within 2 business days.
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
