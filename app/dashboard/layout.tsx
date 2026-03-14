"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string>("admin")

  useEffect(() => {
    // Get user role from session check API
    async function getUserRole() {
      try {
        const response = await fetch("/api/auth/check-session")
        if (response.ok) {
          const data = await response.json()
          setUserRole(data.user?.role || "admin")
        }
      } catch (error) {
        console.error("Failed to get user role:", error)
      }
    }

    getUserRole()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-3">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto">
            <SiteHeader />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="flex flex-col gap-4 p-4">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
