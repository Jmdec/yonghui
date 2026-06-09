"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  type: "bot" | "user";
  text: string;
}

type Step = "name" | "email" | "chat";

const BOT_REPLIES: Record<string, string> = {
  destinations:
    "We cover 200+ countries worldwide! 🌏 From Southeast Asia to Europe, we've got you connected. Visit our Destinations page to browse all available plans.",
  plans:
    "We offer flexible data plans starting from as low as $5. Choose from daily, weekly, or monthly plans depending on your trip. Want me to point you to our plan catalog?",
  activate:
    "Activation is instant — under 3 minutes! After purchase, you'll receive a QR code by email. Just scan it in your phone settings and you're connected. ⚡",
  esim: "An eSIM is a digital SIM card built into your phone. No physical card needed — just scan a QR code and get connected instantly. Check out our 'What is eSIM' page for more!",
  support:
    "Our support team is available 24/7! 💬 You can also email us or use the Contact page. We typically respond within minutes.",
  price:
    "Our plans are transparent with no hidden fees or surprise roaming charges. 💰 Prices vary by destination — browse our Destinations page to see exact pricing.",
  roaming:
    "No roaming fees with YH! That's the whole point of eSIM — you get a local data connection without paying your home carrier's roaming rates.",
  compatible:
    "Most modern smartphones support eSIM, including iPhone XS and newer, Samsung Galaxy S20+, Google Pixel 3 and newer, and many more. Check your phone settings for 'eSIM' or 'Add Mobile Plan'.",
  refund:
    "We offer refunds for unused plans. Once an eSIM is activated, we handle it case-by-case. Reach out via our Contact page and our team will take care of you.",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/dest|countr|where|cover/)) return BOT_REPLIES.destinations;
  if (lower.match(/plan|data|gb|package/)) return BOT_REPLIES.plans;
  if (lower.match(/activ|setup|install|qr|scan/)) return BOT_REPLIES.activate;
  if (lower.match(/what is esim|esim\?|how.*esim|explain/))
    return BOT_REPLIES.esim;
  if (lower.match(/support|help|contact|agent|human/))
    return BOT_REPLIES.support;
  if (lower.match(/price|cost|cheap|afford|how much/)) return BOT_REPLIES.price;
  if (lower.match(/roam/)) return BOT_REPLIES.roaming;
  if (lower.match(/compat|work.*phone|my phone|support.*device/))
    return BOT_REPLIES.compatible;
  if (lower.match(/refund|cancel|money back/)) return BOT_REPLIES.refund;
  return "Thanks for your message! Our support team will follow up with you shortly at the email you provided. In the meantime, feel free to browse our Destinations page for available plans. 🌐";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "👋 Welcome to YH Support! Before we begin, what's your name?",
    },
  ]);
  const [input, setInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const pushBot = (text: string) =>
    setMessages((prev) => [...prev, { type: "bot", text }]);

  const pushUser = (text: string) =>
    setMessages((prev) => [...prev, { type: "user", text }]);

  const handleSend = () => {
    const val = input.trim();
    if (!val) return;
    setInput("");

    if (step === "name") {
      pushUser(val);
      setUserName(val);
      setStep("email");
      setTimeout(() => {
        pushBot(
          `Nice to meet you, ${val}! 😊 Now, what's your email address? We'll use it to send you your eSIM details and follow up if needed.`,
        );
      }, 400);
      return;
    }

    if (step === "email") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!emailOk) {
        setEmailError("Please enter a valid email address.");
        return;
      }
      setEmailError("");
      pushUser(val);
      setUserEmail(val);
      setStep("chat");
      setTimeout(() => {
        pushBot(
          `Perfect! ✅ We've got you noted, ${userName}. We'll reach you at ${val} if needed.\n\nHow can I help you today? You can ask me about:\n• eSIM plans & pricing\n• Supported countries\n• Device compatibility\n• Activation steps\n• Refunds & support`,
        );
      }, 400);
      return;
    }

    // Chat phase
    pushUser(val);
    setTimeout(() => {
      pushBot(getBotReply(val));
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const getPlaceholder = () => {
    if (step === "name") return "Enter your name...";
    if (step === "email") return "Enter your email...";
    return "Ask about plans, countries, activation...";
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ zIndex: 9999 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all"
        aria-label="Open chat"
      >
        <style>{`
          .yh-fab {
            background: linear-gradient(135deg, #0055ff, #00b8ff);
            animation: fab-glow 3s ease-in-out infinite;
          }
          @keyframes fab-glow {
            0%,100% { box-shadow: 0 8px 28px rgba(0,114,255,0.45); }
            50%      { box-shadow: 0 8px 44px rgba(0,180,255,0.7); }
          }
        `}</style>
        <span className="yh-fab absolute inset-0 rounded-full" />
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10" />
      </button>
    );
  }

  return (
    <>
      <style>{`
        .yh-chat-msg { white-space: pre-line; }
        .yh-chat-header {
          background: linear-gradient(135deg, #0055ff, #00b8ff);
        }
        .yh-step-indicator {
          display: flex; gap: 5px; align-items: center;
        }
        .yh-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transition: background 0.3s;
        }
        .yh-dot.active { background: #fff; }
        .yh-typing span {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #6b9dc2;
          animation: typing-dot 1.2s ease-in-out infinite;
          margin: 0 1px;
        }
        .yh-typing span:nth-child(2) { animation-delay: 0.2s; }
        .yh-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-dot {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }
      `}</style>

      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/40 sm:hidden"
        style={{ zIndex: 9998 }}
        onClick={() => setIsOpen(false)}
      />

      <div
        style={{ zIndex: 9999 }}
        className="fixed flex flex-col rounded-xl border border-blue-200/40 bg-white shadow-2xl
          inset-x-2 bottom-2 top-16
          sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:max-h-[calc(100vh-5rem)]"
      >
        {/* Header */}
        <div className="yh-chat-header flex items-center justify-between p-3 sm:p-4 text-white rounded-t-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                YH
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-blue-500" />
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight">
                YH Support
              </div>
              <div className="text-[10px] text-blue-100 leading-tight">
                200+ countries · 24/7 live
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Step dots */}
            <div className="yh-step-indicator">
              {(["name", "email", "chat"] as Step[]).map((s) => (
                <div
                  key={s}
                  className={`yh-dot ${step === s || (s === "name" && step !== "name") || (s === "email" && step === "chat") ? "active" : ""}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step label */}
        {step !== "chat" && (
          <div className="flex-shrink-0 bg-blue-50 border-b border-blue-100 px-4 py-2 text-[11px] text-blue-500 font-medium tracking-wide uppercase">
            {step === "name"
              ? "Step 1 of 2 — Your Name"
              : "Step 2 of 2 — Your Email"}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:h-80 sm:flex-none">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {msg.type === "bot" && (
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mb-0.5"
                  style={{
                    background: "linear-gradient(135deg,#0055ff,#00b8ff)",
                  }}
                >
                  YH
                </div>
              )}
              <div
                className={`yh-chat-msg max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.type === "user"
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm bg-blue-50 text-slate-700 border border-blue-100"
                }`}
                style={
                  msg.type === "user"
                    ? { background: "linear-gradient(135deg,#0055ff,#00b8ff)" }
                    : {}
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Email error */}
        {emailError && (
          <div className="flex-shrink-0 px-4 py-1.5 bg-red-50 border-t border-red-100 text-red-500 text-xs">
            {emailError}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-blue-100 p-3 sm:p-4 flex-shrink-0 bg-gray-50/50 rounded-b-xl">
          <div className="flex gap-2">
            <input
              type={step === "email" ? "email" : "text"}
              placeholder={getPlaceholder()}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (emailError) setEmailError("");
              }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg,#0055ff,#00b8ff)" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 text-center">
            Powered by YH · eSIM Global Network
          </div>
        </div>
      </div>
    </>
  );
}
