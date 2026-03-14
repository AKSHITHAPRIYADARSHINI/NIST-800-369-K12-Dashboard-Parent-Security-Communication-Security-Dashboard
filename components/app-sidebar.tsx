"use client"

import * as React from "react"
import { Shield, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
}

interface NavSection {
  title: string
  url?: string
  items?: NavItem[]
}

// Role-based navigation data
const getNavigationByRole = (role: string): NavSection[] => {
  switch (role) {
    case "parent":
      return [
        {
          title: "Home",
          url: "/dashboard",
          items: [
            { title: "Dashboard", url: "/dashboard" },
          ],
        },
        {
          title: "Student Data",
          url: "#",
          items: [
            { title: "Data Protection", url: "/dashboard" },
            { title: "Privacy Practices", url: "/dashboard" },
            { title: "FERPA Information", url: "/dashboard" },
          ],
        },
        {
          title: "Learning Systems",
          url: "#",
          items: [
            { title: "Approved Apps", url: "/dashboard" },
            { title: "Platform Security", url: "/dashboard" },
          ],
        },
        {
          title: "Cybersecurity",
          url: "#",
          items: [
            { title: "Login Protection", url: "/dashboard" },
            { title: "Threat Monitoring", url: "/dashboard" },
            { title: "Device Protection", url: "/dashboard" },
          ],
        },
        {
          title: "Alerts & Updates",
          url: "#",
          items: [
            { title: "Incident Updates", url: "/dashboard" },
            { title: "Security Resources", url: "/dashboard" },
          ],
        },
      ]

    case "teacher":
      return [
        {
          title: "Home",
          url: "/dashboard",
          items: [
            { title: "Dashboard", url: "/dashboard" },
          ],
        },
        {
          title: "My Security",
          url: "#",
          items: [
            { title: "Security Status", url: "/dashboard" },
            { title: "MFA Settings", url: "/dashboard" },
            { title: "Device Compliance", url: "/dashboard" },
            { title: "Training Progress", url: "/dashboard" },
          ],
        },
        {
          title: "Classroom",
          url: "#",
          items: [
            { title: "Approved Tools", url: "/dashboard" },
            { title: "Vendor Security", url: "/dashboard" },
            { title: "Restricted Apps", url: "/dashboard" },
          ],
        },
        {
          title: "Data Handling",
          url: "#",
          items: [
            { title: "Best Practices", url: "/dashboard" },
            { title: "Data Classification", url: "/dashboard" },
          ],
        },
        {
          title: "Reporting",
          url: "#",
          items: [
            { title: "Report Phishing", url: "/dashboard" },
            { title: "Report Incident", url: "/dashboard" },
          ],
        },
        {
          title: "Alerts & Training",
          url: "#",
          items: [
            { title: "Security Alerts", url: "/dashboard" },
            { title: "Awareness Training", url: "/dashboard" },
          ],
        },
      ]

    case "admin":
      return [
        {
          title: "Home",
          url: "/dashboard",
          items: [
            { title: "Dashboard", url: "/dashboard" },
          ],
        },
        {
          title: "Analytics",
          url: "#",
          items: [
            { title: "Security Overview", url: "/dashboard/security-overview" },
            { title: "Authentication", url: "/dashboard/users/mfa" },
            { title: "Device Security", url: "/dashboard/devices" },
            { title: "Incident Trends", url: "/dashboard/incidents/active" },
          ],
        },
        {
          title: "Compliance",
          url: "#",
          items: [
            { title: "NIST 800-369", url: "/dashboard/compliance" },
            { title: "Control Mapping", url: "/dashboard/compliance/control-mapping" },
            { title: "Compliance Score", url: "/dashboard/compliance" },
            { title: "Assessment", url: "/dashboard/compliance" },
          ],
        },
        {
          title: "User Management",
          url: "#",
          items: [
            { title: "Manage Users", url: "/dashboard/users" },
            { title: "Assign Roles", url: "/dashboard/users/roles" },
            { title: "IAM Policies", url: "/dashboard/settings/policies" },
            { title: "MFA Enforcement", url: "/dashboard/users/mfa" },
          ],
        },
        {
          title: "Devices & Endpoints",
          url: "#",
          items: [
            { title: "Managed Devices", url: "/dashboard/devices" },
            { title: "Compliance Status", url: "/dashboard/devices" },
            { title: "Risk Alerts", url: "/dashboard/devices" },
          ],
        },
        {
          title: "Vendor Security",
          url: "#",
          items: [
            { title: "Vendor Assessment", url: "/dashboard/vendors/assessment" },
            { title: "Risk Scoring", url: "/dashboard/vendors/assessment" },
            { title: "EdTech Security", url: "/dashboard/vendors/assessment" },
          ],
        },
        {
          title: "Incident Response",
          url: "#",
          items: [
            { title: "Active Incidents", url: "/dashboard/incidents/active" },
            { title: "Timeline", url: "/dashboard/incidents/active" },
            { title: "Response Status", url: "/dashboard/incidents/active" },
          ],
        },
        {
          title: "Reports & Audit",
          url: "#",
          items: [
            { title: "Security Reports", url: "/dashboard/reports/access-logs" },
            { title: "Compliance Reports", url: "/dashboard/reports/access-logs" },
            { title: "Access Logs", url: "/dashboard/reports/access-logs" },
            { title: "Audit Trail", url: "/dashboard/reports/access-logs" },
          ],
        },
        {
          title: "Settings",
          url: "#",
          items: [
            { title: "Security Policies", url: "/dashboard/settings/policies" },
            { title: "System Settings", url: "/dashboard/settings/policies" },
          ],
        },
      ]

    default:
      return []
  }
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole?: string
}

export function AppSidebar({ userRole = "admin", ...props }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const navigation = getNavigationByRole(userRole)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        toast.success("Logged out successfully")
        router.push("/auth/login")
      }
    } catch (error) {
      toast.error("Logout failed")
      setIsLoggingOut(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      parent: "Parent Portal",
      teacher: "Teacher Dashboard",
      admin: "Admin Console",
    }
    return labels[role] || "Dashboard"
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Shield className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">NIST 800-369</span>
                <span className="text-xs">{getRoleLabel(userRole)}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton className="font-medium" onClick={() => item.url && item.url !== "#" && (window.location.href = item.url)}>
                  {item.title}
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton isActive={pathname === subItem.url} onClick={() => router.push(subItem.url)}>
                          {subItem.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/dashboard/profile")}>
              <User className="size-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="size-4" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
