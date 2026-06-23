import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Moolre | Auth",
  description: "Sign in or create a company account on Moolre.",
};

function SalaryCard() {
  return (
    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white w-72 shadow-xl">
      <div className="flex items-center justify-between text-sm font-medium mb-3">
        <span className="text-white/80">Kwame&apos;s salary this month</span>
        <span className="font-semibold">GHS 5,000</span>
      </div>

      <div className="h-2 rounded-full bg-white/20 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: "70%",
            background: "linear-gradient(90deg, var(--color-spendable) 0%, var(--color-amber-400) 100%)",
          }}
        />
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
            <span className="size-2 rounded-full bg-spendable" />
            Spendable
          </div>
          <p className="font-semibold">GHS 3,500</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-white/70 mb-0.5">
            <span className="size-2 rounded-full bg-amber-400" />
            Safe wallet
          </div>
          <p className="font-semibold">GHS 1,500</p>
        </div>
      </div>
    </div>
  );
}

// Auth layout 
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, var(--color-green-600) 0%, var(--color-green-400) 40%, var(--color-amber-600) 100%)",
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/assets/logo.png"
            alt="Klare by Moolre"
            width={100}
            height={32}
            className="object-contain brightness-200 invert"
          />
        </div>

        {/* Hero copy + card */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <p className="text-white/60 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              Salary, already sorted
            </p>
            <h1 className="text-white text-4xl font-bold leading-snug">
              Pay your team.
              <br />
              Their bills sort
              <br />
              themselves.
            </h1>
          </div>
          <SalaryCard />
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/40 text-xs">Powered by Moolre</p>
      </div>

      {/* RIGHT PANEL (auth page content) */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-mist-50">
        {children}
      </div>
    </div>
  );
}
