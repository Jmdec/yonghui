import { ReactNode } from "react";

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glow" | "highlight";
}

export function PremiumCard({
  children,
  className = "",
  variant = "default",
}: PremiumCardProps) {
  const variants = {
    default:
      "border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-cyan-950/30 hover:border-cyan-400/60",
    glow: "border border-cyan-500/30 bg-gradient-to-br from-blue-950/60 via-cyan-950/40 to-blue-950/50 hover:border-cyan-400/80 hover:shadow-lg hover:shadow-cyan-500/20",
    highlight:
      "border border-cyan-400/40 bg-gradient-to-br from-cyan-950/50 via-blue-950/40 to-cyan-950/30 hover:border-cyan-300/60 hover:shadow-xl hover:shadow-cyan-400/15",
  };

  return (
    <div
      className={`p-6 rounded-xl backdrop-blur-sm transition-all duration-300 ${variants[variant]} ${className} group`}
    >
      {children}
    </div>
  );
}
