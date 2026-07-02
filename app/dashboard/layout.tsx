"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useMe } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: meData } = useMe();
  const [mode, setMode] = useState<"live" | "sandbox">("live");
  const [hasNotification, setHasNotification] = useState(true);

  useEffect(() => {
    if (meData?.data.company) {
      setMode(meData.data.company.liveMode ? "live" : "sandbox");
    }
  }, [meData?.data.company.liveMode]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 bg-white flex flex-col sm:flex-row sm:items-center gap-4 border-b px-6 py-4 shrink-0 mb-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1 w-full">
            <DashboardHeader
              mode={mode}
              setMode={setMode}
              hasNotification={hasNotification}
              setHasNotification={setHasNotification}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
