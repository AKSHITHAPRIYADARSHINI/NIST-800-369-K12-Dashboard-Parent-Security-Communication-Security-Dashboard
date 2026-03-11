"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useLiveDashboard } from "@/lib/use-live-dashboard"
import type { UserRole } from "@/lib/nist-mock-data"

import data from "./data.json"

export default function Page() {
  const [role, setRole] = useState<UserRole>("admin")
  const { metrics, chartData, incidents, lastUpdated } = useLiveDashboard(role)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader role={role} onRoleChange={setRole} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards metrics={metrics} lastUpdated={lastUpdated} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive chartData={chartData} role={role} />
              </div>
              <DataTable data={incidents} role={role} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
