"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { ChartAreaDefault } from "@/components/charts/chart-area-default"
import { ChartAreaStacked } from "@/components/charts/chart-area-stacked"
import { ChartBarInteractive } from "@/components/charts/chart-bar-interactive"
import { ChartLineLinear } from "@/components/charts/chart-line-linear"
import { ChartPieLabel } from "@/components/charts/chart-pie-label"
import { ChartRadialLabel } from "@/components/charts/chart-radial-label"

export default function Page() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((json) => setData(json.data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading dashboard: {error}</AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Alert>
        <AlertDescription>No data available</AlertDescription>
      </Alert>
    )
  }

  const { metrics = {}, summary = {}, topRisks = [], domainScores = [], lastUpdated } = data
  const {
    complianceScore = 0,
    deviceCompliance = 0,
    mfaAdoption = 0,
    incidentResolutionRate = 0,
  } = metrics

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{complianceScore}</div>
            <p className="text-xs text-muted-foreground mt-2">Overall security posture</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Device Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{deviceCompliance}%</div>
            <p className="text-xs text-muted-foreground mt-2">Patched & encrypted</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">MFA Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mfaAdoption}%</div>
            <p className="text-xs text-muted-foreground mt-2">Users with MFA enabled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Incident Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{incidentResolutionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">Incidents resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartAreaDefault />
        <ChartAreaStacked />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartBarInteractive />
        </div>
        <ChartLineLinear />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPieLabel />
        <ChartRadialLabel />
      </div>

      {/* Domain Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Security Domain Scores</CardTitle>
          <CardDescription>Performance across NIST-aligned security domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainScores.map((domain: any) => (
              <div key={domain.domain} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{domain.domain}</p>
                  <p className="text-sm text-muted-foreground">Score: {Math.round(domain.score)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-blue-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-900 h-2 rounded-full" style={{ width: `${domain.score}%` }} />
                  </div>
                  {domain.trend > 0 && <span className="text-green-600 text-sm">↑</span>}
                  {domain.trend < 0 && <span className="text-red-600 text-sm">↓</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Risks */}
      {topRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Security Risks</CardTitle>
            <CardDescription>High-risk assets requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topRisks.map((risk: any) => (
                <div key={risk.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded border-l-4 border-l-red-600">
                  <span className="font-medium text-foreground">{risk.name}</span>
                  <Badge variant="destructive">{risk.riskLevel}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Control Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Done</span>
                <span className="font-bold text-green-600">{summary.controls?.done || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress</span>
                <span className="font-bold text-yellow-600">{summary.controls?.inProcess || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Not Started</span>
                <span className="font-bold text-blue-600">{summary.controls?.notStarted || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Incident Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Open</span>
                <span className="font-bold text-red-600">{summary.incidents?.open || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Critical</span>
                <span className="font-bold text-destructive">{summary.incidents?.critical || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Resolved</span>
                <span className="font-bold text-green-600">{summary.incidents?.resolved || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
      )}
    </div>
  )
}
