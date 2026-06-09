import { ReactNode } from "react";
import { Navigation } from "./nav";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
}

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {children}
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      {children}
    </div>
  );
}
