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

const cookieTable = [
  {
    name: "yh_session",
    type: "Essential",
    duration: "Session",
    purpose:
      "Keeps you logged in during your visit. Deleted when you close the browser.",
  },
  {
    name: "yh_auth",
    type: "Essential",
    duration: "30 days",
    purpose:
      "Remembers your authentication state so you don't need to log in on every visit.",
  },
  {
    name: "yh_cart",
    type: "Essential",
    duration: "7 days",
    purpose: "Stores your eSIM plan selections before checkout.",
  },
  {
    name: "_ga, _gid",
    type: "Analytics",
    duration: "2 years / 24 hrs",
    purpose:
      "Google Analytics — measures how users navigate the site. All data is anonymised.",
  },
  {
    name: "yh_prefs",
    type: "Functional",
    duration: "1 year",
    purpose: "Remembers your preferences such as language and currency.",
  },
  {
    name: "fbp",
    type: "Marketing",
    duration: "3 months",
    purpose:
      "Facebook Pixel — used to measure ad effectiveness. Only set if you accept marketing cookies.",
  },
];

const sections = [
  {
    icon: "🍪",
    title: "What Are Cookies?",
    content: `Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to website owners.

YH uses cookies and similar technologies (such as local storage and pixel tags) to operate our platform, understand how you use it, and improve your experience.`,
  },
  {
    icon: "🗂️",
    title: "Types of Cookies We Use",
    content: `We use four categories of cookies:

Essential cookies — required for the site to function. Without them, features like login and checkout do not work. These cannot be disabled.

Functional cookies — remember your preferences (e.g. language, currency) to personalise your experience.

Analytics cookies — help us understand how visitors use the site so we can improve it. Data is aggregated and anonymised.

Marketing cookies — used to measure the effectiveness of our advertising campaigns. Only set with your consent.`,
  },
  {
    icon: "🔧",
    title: "Managing Your Preferences",
    content: `You can manage or withdraw your consent to non-essential cookies at any time using our Cookie Preferences panel (accessible via the "Cookie Settings" link in the footer).

You may also control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies will affect how the site functions.

For information on managing cookies in your specific browser, visit its help documentation.`,
  },
  {
    icon: "🤝",
    title: "Third-Party Cookies",
    content: `Some cookies on our site are set by third-party services we use, including Google Analytics and payment processors. These third parties have their own privacy policies governing their use of such information.

We do not control these third-party cookies. If you have concerns, please refer to the relevant third party's privacy policy.`,
  },
  {
    icon: "🔄",
    title: "Changes to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our practices. We will notify you of material changes via a notice on our site.

The "Last updated" date at the top of this page indicates when the policy was last revised.`,
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

function CookieTable() {
  const { ref, visible } = useFadeIn();
  const typeColors: Record<string, string> = {
    Essential: "#0072FF",
    Analytics: "#00a86b",
    Functional: "#8b5cf6",
    Marketing: "#f59e0b",
  };
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(0,140,255,0.18)",
        borderRadius: 16,
        overflow: "hidden",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 16px rgba(0,80,200,0.07)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
      }}
    >
      <div
        style={{
          padding: "18px 22px 14px",
          borderBottom: "1px solid rgba(0,114,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "rgba(0,114,255,0.08)",
              border: "1px solid rgba(0,114,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            📊
          </div>
          <h2
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontWeight: 800,
              color: "#002f6c",
              fontSize: "1.05rem",
              margin: 0,
            }}
          >
            Cookie Reference Table
          </h2>
        </div>
      </div>
      <div style={{ overflowX: "auto" as const }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse" as const,
            fontSize: "0.82rem",
          }}
        >
          <thead>
            <tr style={{ background: "rgba(0,114,255,0.04)" }}>
              {["Cookie Name", "Category", "Duration", "Purpose"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left" as const,
                    fontWeight: 700,
                    color: "#2e6a96",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    borderBottom: "1px solid rgba(0,114,255,0.1)",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cookieTable.map((row, i) => (
              <tr
                key={row.name}
                style={{
                  background:
                    i % 2 === 0 ? "transparent" : "rgba(0,114,255,0.02)",
                }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(0,114,255,0.07)",
                    fontFamily: "monospace",
                    color: "#0055cc",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {row.name}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(0,114,255,0.07)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      background: `${typeColors[row.type]}18`,
                      border: `1px solid ${typeColors[row.type]}40`,
                      borderRadius: 999,
                      padding: "2px 10px",
                      color: typeColors[row.type],
                      fontWeight: 700,
                      fontSize: "0.73rem",
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    {row.type}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(0,114,255,0.07)",
                    color: "#4a7ea0",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {row.duration}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(0,114,255,0.07)",
                    color: "#3d6090",
                    lineHeight: 1.6,
                  }}
                >
                  {row.purpose}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CookiePolicyPage() {
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
          Cookie{" "}
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
          This policy explains how YH uses cookies and similar technologies
          on our website and what choices you have.
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
        {sections.slice(0, 2).map((s, i) => (
          <PolicySection key={s.title} {...s} index={i} />
        ))}

        {/* Cookie table between sections */}
        <CookieTable />

        {sections.slice(2).map((s, i) => (
          <PolicySection key={s.title} {...s} index={i + 3} />
        ))}

        {/* CTA */}
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
            🍪
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
              Want to update your cookie preferences?
            </div>
            <div style={{ color: "#4a7ea0", fontSize: "0.83rem" }}>
              Click "Cookie Settings" in the footer at any time, or email{" "}
              <a
                href="mailto:privacy@YH.com"
                style={{
                  color: "#0072FF",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                privacy@YH.com
              </a>
              .
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
