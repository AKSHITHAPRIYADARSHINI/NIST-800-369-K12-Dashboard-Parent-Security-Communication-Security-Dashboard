"use client"

import { BarChart3, CheckSquare, Home, LayoutGrid, Settings, Users, FileText, MoreHorizontal } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            🛡️
          </div>
          <span className="font-semibold">NIST 800-369</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <div className="mb-6">
            <p className="px-2 py-2 text-xs font-semibold text-muted-foreground">Home</p>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <a href="#home" className="flex items-center gap-2 w-full">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>

          <div className="mb-6">
            <p className="px-2 py-2 text-xs font-semibold text-muted-foreground">Main</p>
            <div className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <a href="#dashboard" className="flex items-center gap-2 w-full">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#compliance" className="flex items-center gap-2 w-full">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Compliance Status</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#controls" className="flex items-center gap-2 w-full">
                    <Settings className="h-4 w-4" />
                    <span>Security Controls</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#assets" className="flex items-center gap-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>Assets & Inventory</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#team" className="flex items-center gap-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>Team Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          </div>

          <div className="mb-6">
            <p className="px-2 py-2 text-xs font-semibold text-muted-foreground">Documentation</p>
            <div className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#assessment" className="flex items-center gap-2 w-full">
                    <FileText className="h-4 w-4" />
                    <span>Assessment Results</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#reports" className="flex items-center gap-2 w-full">
                    <BarChart3 className="h-4 w-4" />
                    <span>Compliance Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <a href="#policies" className="flex items-center gap-2 w-full">
                    <CheckSquare className="h-4 w-4" />
                    <span>Policies & Procedures</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="#more" className="flex items-center gap-2 w-full">
                <MoreHorizontal className="h-4 w-4" />
                <span>More</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="#settings" className="flex items-center gap-2 w-full">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <a href="#admin" className="flex items-center gap-3 w-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  A
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin</span>
                  <span className="truncate text-xs">security@k12.edu</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
