"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

interface ActivationData {
  order_id: string;
  reference: string;
  activation_code: string;
  destination: string;
  plan_data: string;
  plan_duration: number;
  plan_name: string;
  created_at: string;
}

function ActivateContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const qrRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<ActivationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No activation token provided");
      setLoading(false);
      return;
    }

    fetchActivation();
  }, [token]);

  const fetchActivation = async () => {
    try {
      const res = await fetch(`/api/activate?token=${token}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Failed to load activation details");
        return;
      }

      setData(json);
    } catch (err) {
      setError("Error loading activation details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.activation_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy code");
    }
  };

  const downloadQR = () => {
    const element = qrRef.current?.querySelector("canvas");
    if (!element) return;

    const link = document.createElement("a");
    link.href = element.toDataURL("image/png");
    link.download = `esim-qr-${data?.reference}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">
            Loading your eSIM activation details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">No activation data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.6s ease-out; }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); } }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 slide-in">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ready to Activate
          </h1>
          <p className="text-lg text-gray-600">
            Scan the QR code or enter the code manually on your phone
          </p>
        </div>

        {/* Plan Details */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8 slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Plan</p>
              <p className="text-lg font-bold text-gray-900">
                {data.plan_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Data</p>
              <p className="text-lg font-bold text-gray-900">
                {data.plan_data}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Validity</p>
              <p className="text-lg font-bold text-gray-900">
                {data.plan_duration} days
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-semibold">
              Order Reference
            </p>
            <p className="text-lg font-mono font-bold text-blue-600">
              {data.reference}
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 slide-in border border-blue-100"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Scan to Activate
          </h2>

          <div
            ref={qrRef}
            className="flex justify-center mb-6 bg-white p-6 rounded-lg"
          >
            <QRCodeCanvas
              value={data.activation_code}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-center text-gray-600 text-sm mb-4">
            Use your phone to scan this QR code
          </p>

          <button
            onClick={downloadQR}
            className="w-full px-6 py-3 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
          >
            Download QR Code
          </button>
        </div>

        {/* Activation Code Section */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8 slide-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Activation Code
          </h2>

          <div className="bg-gray-900 rounded-lg p-6 mb-4">
            <p className="text-gray-400 text-sm mb-2">Your Code:</p>
            <p className="text-white text-2xl font-mono font-bold tracking-wider break-all">
              {data.activation_code}
            </p>
          </div>

          <button
            onClick={copyCode}
            className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors ${
              copied
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Instructions */}
        <div
          className="bg-blue-50 rounded-lg p-8 mb-8 slide-in border border-blue-100"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Activate
          </h2>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Open Settings",
                desc: "Go to your phone's Settings app",
                color: "bg-blue-500",
              },
              {
                step: "2",
                title: "Go to Cellular",
                desc: "Navigate to Cellular → Cellular Plans (or Mobile Data)",
                color: "bg-blue-500",
              },
              {
                step: "3",
                title: "Add Cellular Plan",
                desc: 'Tap "Add Cellular Plan" or "Add Plan"',
                color: "bg-blue-500",
              },
              {
                step: "4",
                title: "Scan or Enter",
                desc: 'Scan the QR code above OR tap "Enter Details Manually" and paste your code',
                color: "bg-blue-500",
              },
              {
                step: "5",
                title: "Select Carrier",
                desc: "Choose your destination carrier (e.g., Vodafone Spain, NTT Docomo Japan)",
                color: "bg-blue-500",
              },
              {
                step: "✓",
                title: "Done!",
                desc: "Your eSIM will activate within 1-2 minutes",
                color: "bg-green-500",
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white text-sm font-bold`}
                  >
                    {step}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div
          className="bg-white rounded-lg p-8 slide-in border border-gray-200"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="text-center text-gray-600">
            Having trouble? Contact our{" "}
            <a
              href="mailto:support@esim.com"
              className="text-blue-600 hover:underline font-semibold"
            >
              24/7 support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ActivateContent />
    </Suspense>
  );
}
