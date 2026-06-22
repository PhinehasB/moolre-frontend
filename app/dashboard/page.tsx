"use client";

import { TeamTable } from "@/components/tables/team-table";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [walletBalance, setWalletBalance] = useState(38200);
  const [activeEmployees, setActiveEmployees] = useState(9);
  const [hasNotification, setHasNotification] = useState(true);
  const [mode, setMode] = useState<"live" | "sandbox">("live");

  // Dynamically calculate total to pay based on employee count
  const totalToPay = activeEmployees === 9 ? 47500 : 47400;
  const isFunded = walletBalance >= totalToPay;
  const deficit = totalToPay - walletBalance;

  // Handle funding the wallet (simulates success and balance update)
  const handleFundWallet = () => {
    setWalletBalance(48200);
  };

  const handleRunPayroll = () => {
    if (!isFunded) {
      alert(
        `Insufficient funds! Please top up GHS ${deficit.toLocaleString()} to complete the payroll.`,
      );
    } else {
      alert("Payroll processed successfully!");
    }
  };

  const stats = [
    {
      id: "active-employees",
      label: "Active employees",
      value: activeEmployees,
      subtext: "+2 added this month",
      subtextColor: "text-[#1d9e75] font-semibold",
      icon: Users,
      iconBg: "bg-green-50 text-[#0f6e56]",
      onClick: () => setActiveEmployees((prev) => (prev === 9 ? 8 : 9)),
      title: "Click to toggle between 8 and 9 employees",
      className: "hover:border-green-200 hover:shadow-md cursor-pointer",
      iconClassName: "group-hover:scale-105 transition-transform",
    },
    {
      id: "pending-onboarding",
      label: "Pending onboarding",
      value: "2",
      subtext: "waiting to set their password",
      subtextColor: "text-gray-400",
      icon: UserPlus,
      iconBg: "bg-amber-50 text-[#ba7517]",
    },
    {
      id: "paid-last-month",
      label: "Paid last month",
      value: "GHS 45,000",
      subtext: "May 28 • 100% success",
      subtextColor: "text-gray-400",
      icon: Calendar,
      iconBg: "bg-red-50 text-[#d85a30]",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Title Header */}

      {/* Underfunded warning banner */}
      {!isFunded && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#fff8eb] border border-[#ffe0b2] rounded-2xl p-4 text-sm text-[#854f0b] shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#ffe0b2] text-[#ba7517] shrink-0">
              <AlertTriangle className="size-4" />
            </div>
            <p className="font-medium text-amber-900">
              Your next payroll is GHS {totalToPay.toLocaleString()} but your
              wallet sits at GHS {walletBalance.toLocaleString()}. Top up GHS{" "}
              {deficit.toLocaleString()} before Jun 28 to pay everyone.
            </p>
          </div>
          <button
            onClick={handleFundWallet}
            className="bg-[#ba7517] hover:bg-[#854f0b] text-white font-semibold px-4 py-2 rounded-xl text-xs whitespace-nowrap active:scale-95 transition-all duration-150 shrink-0"
          >
            Top up wallet
          </button>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet balance card */}
        <div className="flex flex-col justify-between bg-[#0f6e56] text-white rounded-2xl p-6 shadow-sm md:col-span-2">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium mb-4 select-none">
              <Wallet className="size-4" />
              <span>Moolre business wallet</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
              GHS {walletBalance.toLocaleString()}.
              <span className="text-white/60 text-2xl font-normal">00</span>
            </h2>
            <div className="flex items-center gap-4 text-white/70 text-xs font-medium select-none">
              <span>Available GHS {walletBalance.toLocaleString()}</span>
              <span className="size-1 rounded-full bg-white/40" />
              <span>Pending in GHS 0</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={handleFundWallet}
              className="flex items-center gap-2 bg-white text-[#0f6e56] hover:bg-white/95 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors active:scale-[0.985] shrink-0"
            >
              <Wallet className="size-4" />
              <span>Fund wallet</span>
            </button>
            <button
              onClick={() => alert("Statement view simulated.")}
              className="border border-white/20 hover:bg-white/10 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors active:scale-[0.985] shrink-0"
            >
              View statement
            </button>
          </div>
        </div>

        {/* Automatic payroll info card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 select-none">
              <span className="text-gray-500 text-xs font-medium">
                Next automatic payroll
              </span>
              <span className="bg-[#e1f5ee] text-[#0f6e56] text-xs font-semibold px-2.5 py-0.5 rounded-full select-none">
                Auto - on
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Jun 28, 2026
            </h3>
            <p className="text-gray-500 text-xs mb-6">
              in 13 days &bull; {activeEmployees} active employees
            </p>

            <hr className="border-gray-100 mb-6" />

            <span className="text-gray-500 text-xs font-medium mb-1 block select-none">
              Total to pay
            </span>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              GHS {totalToPay.toLocaleString()}
            </h4>

            {/* Progress bar & coverage label */}
            <div className="mb-6 select-none">
              <div className="h-2 rounded-full bg-gray-100 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isFunded ? "bg-[#1d9e75]" : "bg-[#ba7517]"}`}
                  style={{
                    width: `${Math.min(100, (walletBalance / totalToPay) * 100)}%`,
                  }}
                />
              </div>
              {isFunded ? (
                <div className="flex items-center gap-1.5 text-xs text-[#1d9e75] font-semibold animate-in fade-in duration-200">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Wallet covers payroll in full</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#ba7517] font-semibold animate-in fade-in duration-200">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>
                    Wallet covers 80% &mdash; top up GHS{" "}
                    {deficit.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleRunPayroll}
            className="w-full bg-[#0f6e56] hover:bg-[#0b5443] text-white font-semibold text-sm py-3 rounded-xl transition-colors active:scale-[0.985] shadow-sm mt-4"
          >
            Run payroll now
          </button>
        </div>
      </div>

      {/* Bottom stats row (Tapping Card 1 toggles employees state between 9 and 8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={stat.onClick}
              className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm select-none transition-all duration-200 group ${
                stat.className || ""
              }`}
              title={stat.title}
            >
              <div
                className={`flex aspect-square size-10 items-center justify-center rounded-xl mb-4 ${
                  stat.iconBg
                } ${stat.iconClassName || ""}`}
              >
                <Icon className="size-5" />
              </div>
              <span className="text-gray-500 text-xs font-medium block mb-1">
                {stat.label}
              </span>
              <h5 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h5>
              <p className={`text-xs ${stat.subtextColor}`}>{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Team Members Table */}
      <TeamTable />
    </div>
  );
}
