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
  useSidebar,
} from "@/components/ui/sidebar";
import { SIDEBAR_GROUPS_LINKS } from "@/utils/mock";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { useAuthInitials } from "@/hooks/use-auth";
import { LogoutDialog } from "@/components/modals/logout-dialog";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() || "";
  const { setOpenMobile, isMobile } = useSidebar();
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
    <Sidebar variant="inset" className="bg-sidebar" {...props}>
      {/* Header / Logo */}
      <SidebarHeader className="bg-sidebar p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3">
              {/* K Logo square */}
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold text-lg select-none shrink-0">
                K
              </div>
              {/* Brand Name */}
              <span className="font-semibold text-gray-900 text-base tracking-tight truncate group-data-[state=collapsed]:hidden">
                Klare
              </span>
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
                  {fullName || "—"}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {company?.name || "—"}
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
