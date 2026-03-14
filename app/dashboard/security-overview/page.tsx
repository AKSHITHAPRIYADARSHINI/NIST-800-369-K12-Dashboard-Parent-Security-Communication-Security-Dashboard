"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { StatCard, AlertCard, StatusGrid } from "@/components/dashboard-ui"
import { Shield, Activity, Lock, AlertTriangle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function SecurityOverviewPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/overview")
      .then(r => r.json())
      .then(json => setData(json.data))
      .catch(err => toast.error("Failed to load overview"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  if (!data) return <div className="p-4">No data available</div>

  const { metrics = {}, summary = {}, topRisks = [], domainScores = [] } = data

  // Sample data for visualizations
  const incidentSeverityData = [
    { name: "Critical", value: 5, fill: "#dc2626" },
    { name: "High", value: 12, fill: "#f97316" },
    { name: "Medium", value: 28, fill: "#eab308" },
    { name: "Low", value: 45, fill: "#22c55e" },
  ]

  const controlTypeData = [
    { type: "Implemented", count: 45, fill: "#10b981" },
    { type: "In Progress", count: 23, fill: "#3b82f6" },
    { type: "Not Started", count: 12, fill: "#6b7280" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Overview</h1>
        <p className="text-muted-foreground mt-2">Real-time security posture and compliance metrics</p>
      </div>

      {/* KPI Cards with enhanced styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Compliance Score"
          value={metrics.complianceScore || 0}
          description="Overall security compliance"
          icon={<Shield className="h-6 w-6" />}
          variant="success"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          title="Device Compliance"
          value={`${metrics.deviceCompliance || 0}%`}
          description="Patched & encrypted devices"
          icon={<Lock className="h-6 w-6" />}
          variant="success"
          trend={{ value: 3, isPositive: true }}
        />

        <StatCard
          title="MFA Adoption"
          value={`${metrics.mfaAdoption || 0}%`}
          description="Users with MFA enabled"
          icon={<Activity className="h-6 w-6" />}
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Incident Resolution"
          value={`${metrics.incidentResolutionRate || 0}%`}
          description="Incidents resolved on time"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentSeverityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Control Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Control Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={controlTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6">
                  {controlTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Domain Security Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Security Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainScores.map((domain: any) => (
              <div key={domain.domain}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{domain.domain}</span>
                  <span className={`font-bold text-lg ${domain.score >= 80 ? 'text-green-600' : domain.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.round(domain.score)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      domain.score >= 80
                        ? 'bg-gradient-to-r from-green-600 to-green-500'
                        : domain.score >= 60
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                          : 'bg-gradient-to-r from-red-600 to-red-500'
                    }`}
                    style={{ width: `${domain.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Grid for Control and Incident Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusGrid
          title="Control Status"
          items={[
            {
              label: "Completed",
              count: summary.controls?.done || 0,
              status: "success",
            },
            {
              label: "In Progress",
              count: summary.controls?.inProcess || 0,
              status: "warning",
            },
            {
              label: "Not Started",
              count: summary.controls?.notStarted || 0,
              status: "neutral",
            },
          ]}
        />

        <StatusGrid
          title="Incident Status"
          items={[
            {
              label: "Open",
              count: summary.incidents?.open || 0,
              status: "danger",
            },
            {
              label: "Critical",
              count: summary.incidents?.critical || 0,
              status: "danger",
            },
            {
              label: "Resolved",
              count: summary.incidents?.resolved || 0,
              status: "success",
            },
          ]}
        />
      </div>

      {/* Top Risks Alert Cards */}
      {topRisks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Security Risks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRisks.map((risk: any) => (
              <AlertCard
                key={risk.id}
                title={risk.name}
                severity={risk.riskLevel === "CRITICAL" ? "critical" : risk.riskLevel === "HIGH" ? "high" : "medium"}
                description={`Risk Level: ${risk.riskLevel}`}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
