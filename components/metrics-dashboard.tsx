"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, CartesianAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface DomainMetric {
  domain: string
  implementationPercentage: number
  status: "Not Started" | "Planned" | "Partial" | "Implemented" | "Optimized"
  controlsImplemented: number
  controlsTotal: number
  lastUpdated: string
}

interface IncidentMetric {
  date: string
  phishing: number
  malware: number
  ransomware: number
  other: number
}

interface MetricsDashboardProps {
  domainMetrics?: DomainMetric[]
  incidentTrends?: IncidentMetric[]
}

const DEFAULT_DOMAIN_METRICS: DomainMetric[] = [
  {
    domain: "Authentication",
    implementationPercentage: 92,
    status: "Implemented",
    controlsImplemented: 23,
    controlsTotal: 25,
    lastUpdated: "Today",
  },
  {
    domain: "Data Protection",
    implementationPercentage: 88,
    status: "Implemented",
    controlsImplemented: 22,
    controlsTotal: 25,
    lastUpdated: "Today",
  },
  {
    domain: "Device Security",
    implementationPercentage: 85,
    status: "Partial",
    controlsImplemented: 21,
    controlsTotal: 25,
    lastUpdated: "Today",
  },
  {
    domain: "Vendor Security",
    implementationPercentage: 80,
    status: "Partial",
    controlsImplemented: 20,
    controlsTotal: 25,
    lastUpdated: "2 days ago",
  },
  {
    domain: "Incident Monitoring",
    implementationPercentage: 90,
    status: "Implemented",
    controlsImplemented: 23,
    controlsTotal: 25,
    lastUpdated: "Today",
  },
  {
    domain: "Compliance",
    implementationPercentage: 87,
    status: "Implemented",
    controlsImplemented: 22,
    controlsTotal: 25,
    lastUpdated: "Today",
  },
]

const DEFAULT_INCIDENT_TRENDS: IncidentMetric[] = [
  { date: "Week 1", phishing: 12, malware: 3, ransomware: 0, other: 2 },
  { date: "Week 2", phishing: 8, malware: 2, ransomware: 0, other: 1 },
  { date: "Week 3", phishing: 15, malware: 4, ransomware: 1, other: 3 },
  { date: "Week 4", phishing: 10, malware: 2, ransomware: 0, other: 2 },
  { date: "Week 5", phishing: 7, malware: 1, ransomware: 0, other: 1 },
  { date: "Week 6", phishing: 9, malware: 3, ransomware: 0, other: 2 },
]

function getStatusColor(status: string): string {
  switch (status) {
    case "Implemented":
    case "Optimized":
      return "bg-green-500"
    case "Partial":
      return "bg-yellow-500"
    case "Planned":
      return "bg-blue-500"
    case "Not Started":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Implemented":
    case "Optimized":
      return "default"
    case "Partial":
      return "secondary"
    case "Planned":
      return "secondary"
    case "Not Started":
      return "destructive"
    default:
      return "outline"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Implemented":
    case "Optimized":
      return <CheckCircle className="size-4 text-green-500" />
    case "Partial":
      return <Clock className="size-4 text-yellow-500" />
    case "Planned":
      return <Clock className="size-4 text-blue-500" />
    case "Not Started":
      return <AlertCircle className="size-4 text-red-500" />
    default:
      return <AlertTriangle className="size-4 text-gray-500" />
  }
}

export function MetricsDashboard({
  domainMetrics = DEFAULT_DOMAIN_METRICS,
  incidentTrends = DEFAULT_INCIDENT_TRENDS,
}: MetricsDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Domain Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security Domain Implementation Status</CardTitle>
          <CardDescription>
            Completion percentage for each security domain across all controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {domainMetrics.map((metric) => (
              <div key={metric.domain} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(metric.status)}
                    <div>
                      <p className="font-medium text-sm">{metric.domain}</p>
                      <p className="text-xs text-muted-foreground">
                        {metric.controlsImplemented} of {metric.controlsTotal} controls
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(metric.status)}>
                      {metric.status}
                    </Badge>
                    <span className="text-sm font-semibold w-12 text-right">
                      {metric.implementationPercentage}%
                    </span>
                  </div>
                </div>
                <Progress value={metric.implementationPercentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incident Detection Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Incident Detection Trends</CardTitle>
          <CardDescription>
            Security incident detections by type over the last 6 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              phishing: { label: "Phishing Attempts", color: "hsl(var(--chart-1))" },
              malware: { label: "Malware Detected", color: "hsl(var(--chart-2))" },
              ransomware: { label: "Ransomware Alerts", color: "hsl(var(--chart-3))" },
              other: { label: "Other Threats", color: "hsl(var(--chart-4))" },
            }}
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart data={incidentTrends}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="phishing" stackId="a" fill="var(--color-phishing)" />
              <Bar dataKey="malware" stackId="a" fill="var(--color-malware)" />
              <Bar dataKey="ransomware" stackId="a" fill="var(--color-ransomware)" />
              <Bar dataKey="other" stackId="a" fill="var(--color-other)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Domain Overview Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {domainMetrics.map((metric) => (
          <Card key={metric.domain} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{metric.domain}</CardTitle>
                  <CardDescription className="text-xs">
                    {metric.controlsImplemented}/{metric.controlsTotal} controls
                  </CardDescription>
                </div>
                {getStatusIcon(metric.status)}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Implementation</span>
                  <span className="font-semibold">{metric.implementationPercentage}%</span>
                </div>
                <Progress value={metric.implementationPercentage} className="h-2" />
              </div>
              <div className="space-y-2 pt-2">
                <Badge variant={getStatusBadgeVariant(metric.status)} className="w-full justify-center">
                  {metric.status}
                </Badge>
                <p className="text-xs text-muted-foreground text-center">
                  Last updated: {metric.lastUpdated}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
