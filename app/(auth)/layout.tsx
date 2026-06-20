import type { Metadata } from "next";
import AuthSlider from "./AuthSlider";

export const metadata: Metadata = {
  title: "Moolre | Auth",
  description: "Sign in or create a company account on Moolre.",
};

// Auth layout 
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <AuthSlider />

      {/* RIGHT PANEL (auth page content) */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-mist-50">
        {children}
      </div>
    </div>
  );
}
