"use client";
import * as React from "react";
import {
  Home,
  UserPlus,
  FileText,
  FlaskConical,
  TestTube,
  Box,
  Users,
  Cog,
  ClipboardList,
} from "lucide-react";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { DiagnoLabHeader } from "./sidebar-header";
import { NavUser } from "./nav-user";
import { useSession } from "next-auth/react";
import { readNameFromJwt, readRoleFromJwt } from "@/lib/auth";
import { capitalizeFirstLetter } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const role = readRoleFromJwt(session?.user.access_token || "");
  const name = readNameFromJwt(session?.user.access_token || "");

  const navItems = [
    {
      icon: Home,
      title: "Request Test",
      href: "/LabManagement/request-test",
    },
    {
      icon: ClipboardList,
      title: "Patient Record",
      href: "/LabManagement/patient-record",
    },
    {
      icon: FileText,
      title: "Reports",
      href: "/LabManagement/test-record",
    },
    {
      icon: FlaskConical,
      title: "Samples",
      href: "/LabManagement/sample-record",
    },
    {
      icon: TestTube,
      title: "Lab Tests",
      href: "/LabManagement/lab-tests",
    },
    {
      icon: Box,
      title: "Inventory",
      href: "/LabManagement/inventory",
    },
    {
      icon: UserPlus,
      title: "Add Patient",
      href: "/LabManagement/add-patient",
    },
    {
      icon: Users,
      title: "Employees",
      href: "/LabManagement/employee",
    },
    {
      icon: Cog,
      title: "Settings",
      href: "/LabManagement/settings",
    },
  ];
  if (role !== "ADMIN") {
    navItems.splice(
      navItems.findIndex((item) => item.title === "Lab Tests"),
      1
    );
    navItems.splice(
      navItems.findIndex((item) => item.title === "Employees"),
      1
    );
  }

  const user = {
    name: capitalizeFirstLetter(name || ""),
    email: name + "@gmail.com",
    avatar: "/images/avatar.jpg",
  };

  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <DiagnoLabHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((navItem, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <NavItem
                      icon={navItem.icon}
                      title={navItem.title}
                      active={pathname === navItem.href}
                      href={navItem.href}
                      key={index}
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
