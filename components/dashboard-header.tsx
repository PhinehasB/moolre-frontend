"use client";

import { DashboardHeaderProps } from "@/interfaces";
import { useDashboardSummary } from "@/hooks/use-dashboard";
import { useMe, useSetMode } from "@/hooks/use-auth";
import { ROUTE_HEADERS, DEFAULT_HEADER } from "@/utils/mock";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({
  mode,
  setMode,
  hasNotification,
  setHasNotification,
  title,
  subtitle,
}: DashboardHeaderProps) {
  const pathname = usePathname() || "";
  const { data: summaryData } = useDashboardSummary();
  const { data: meData } = useMe();
  const setModeMutation = useSetMode();

  const matchedRoute = Object.keys(ROUTE_HEADERS).find((route) =>
    pathname.includes(route)
  );

  const config = matchedRoute ? ROUTE_HEADERS[matchedRoute] : DEFAULT_HEADER;

  const firstName =
    summaryData?.data.greeting.firstName ??
    meData?.data.user.firstName ??
    "there";

  const companyName =
    summaryData?.data.greeting.companyName ??
    meData?.data.company.name;

  const isHome = pathname === "/dashboard" || pathname === "/dashboard/";
  const displayTitle =
    title ?? (isHome ? `${getGreeting()}, ${firstName}` : config.title);
  const displaySubtitle =
    subtitle ??
    (isHome && companyName
      ? `Here's what's happening at ${companyName} today.`
      : config.subtitle);

  const handleSetSandboxMode = () => {
    if (mode === "sandbox") return;
    setModeMutation.mutate(
      { live: false },
      {
        onSuccess: () => {
          setMode("sandbox");
          toast.success("Sandbox mode enabled. No real money will be used.");
        },
        onError: () => toast.error("Failed to switch to Sandbox mode.")
      }
    );
  };

  const handleSetLiveMode = () => {
    if (mode === "live") return;
    setModeMutation.mutate(
      { live: true },
      {
        onSuccess: () => {
          setMode("live");
          toast.success("Live mode enabled. Real transactions will be processed.");
        },
        onError: () => toast.error("Failed to switch to Live mode.")
      }
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
          {displayTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{displaySubtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Sandbox Toggle */}
        <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
          <button
            onClick={handleSetSandboxMode}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${mode === "sandbox"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Sandbox
          </button>
          <button
            onClick={handleSetLiveMode}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${mode === "live"
              ? "bg-black text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Live
          </button>
        </div>

        {/* Bell Icon with badge */}
        <button
          onClick={() => setHasNotification((v) => !v)}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <Bell className="size-5" />
          {hasNotification && (
            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
