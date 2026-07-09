"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_GROUPS_LINKS } from "@/utils/mock";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useAuthInitials } from "@/hooks/use-auth";
import { LogoutDialog } from "@/components/modals/logout-dialog";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() || "";
  const { toggleSidebar, setOpenMobile, isMobile } = useSidebar();
  const { user, company } = useAuthStore();
  const initials = useAuthInitials();

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  const isItemActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-sidebar" {...props}>
      <SidebarHeader className="bg-sidebar p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
        <SidebarMenu>
          <SidebarMenuItem>

            {/* Expanded Header */}
            <div className="flex items-center justify-between w-full h-9 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-base select-none shrink-0">
                  K
                </div>
                <span className="font-bold text-gray-900 text-lg tracking-tight truncate">
                  Klare
                </span>
              </div>
              <button
                onClick={toggleSidebar}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-green-50 transition-colors"
                aria-label="Collapse Sidebar"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="size-5" />
              </button>
            </div>

            {/* Collapsed Header */}
            <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full h-9">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleSidebar}
                      className="group/toggle flex aspect-square size-9 items-center justify-center rounded-full hover:bg-green-50 transition-colors"
                      aria-label="Open Sidebar"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-base select-none shrink-0 group-hover/toggle:hidden">
                        K
                      </div>
                      <PanelLeftOpen className="size-5 text-primary hidden group-hover/toggle:block" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="bg-primary text-primary-foreground font-medium text-xs border-0">
                    Open sidebar
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="bg-sidebar px-2">
        {SIDEBAR_GROUPS_LINKS.map((group) => (
          <SidebarGroup key={group.id} className={group.label ? "mt-2" : ""}>
            {group.label && (
              <SidebarGroupLabel className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase select-none group-data-[state=collapsed]:hidden">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = isItemActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={
                          isActive
                            ? "w-full text-sidebar-accent-foreground bg-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium px-3 py-2 rounded-xl transition-colors"
                            : "w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 font-normal px-3 py-2 rounded-xl transition-colors"
                        }
                      >
                        <Link
                          href={item.url}
                          onClick={() => {
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                          }}
                        >
                          <item.icon
                            className={`size-4 ${isActive ? "text-sidebar-accent-foreground" : "text-gray-500"}`}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Profile + Logout */}
      <SidebarFooter className="bg-sidebar p-4 border-t border-gray-100/80">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 w-full">
              {/* Initials Avatar */}
              <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-[#fce8e6] text-[#a13c2f] font-semibold text-sm select-none shrink-0">
                {initials || "?"}
              </div>
              {/* User Info */}
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden overflow-hidden">
                <span className="truncate font-semibold text-gray-900">
                  {fullName || ""}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {company?.name || ""}
                </span>
              </div>
              <LogoutDialog />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
