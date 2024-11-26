"use client";

import * as React from "react";
import Image from "next/image";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function DiagnoLabHeader({}) {
  useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
            <Image
              src="/svg/logo.svg"
              alt="Logo"
              className="h-6 w-6"
              width={30}
              height={30}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-lg font-semibold">DiagnoLab</span>
            <span className="truncate text-xs">Welcome to DiagnoLab</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
