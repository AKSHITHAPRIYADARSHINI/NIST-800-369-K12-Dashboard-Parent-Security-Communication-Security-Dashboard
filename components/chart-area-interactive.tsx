"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TREND_DATA, getTimeRangeData, type ChartDataPoint, type UserRole } from "@/lib/nist-mock-data"

interface ChartAreaInteractiveProps {
  chartData?: ChartDataPoint[]
  role?: UserRole
}

export function ChartAreaInteractive({ chartData = TREND_DATA, role = "admin" }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = useState<"30" | "90">("90")
  const filteredData = getTimeRangeData(chartData, timeRange === "30" ? 30 : 90)
  const chartConfig = {
    Compliance: { label: "Compliance Score", color: "hsl(var(--chart-1))" },
    Security: { label: "Security Score", color: "hsl(var(--chart-2))" },
    Protection: { label: "Protection Score", color: "hsl(var(--chart-3))" },
  }

  const chartTitle = role === "parent"
    ? "Data Protection Trend"
    : "Security Posture Trend"

  const chartDescription = role === "parent"
    ? "K-12 school data protection and compliance overview"
    : "NIST 800-369 compliance, security, and data protection scores over time"

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{chartTitle}</CardTitle>
          <CardDescription>
            {chartDescription}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "30" | "90")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="date" />
            <YAxis domain={[60, 100]} />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Area
              dataKey="Compliance"
              type="natural"
              fill="var(--color-Compliance)"
              stroke="var(--color-Compliance)"
              fillOpacity={0.4}
            />
            {role !== "parent" && (
              <Area
                dataKey="Security"
                type="natural"
                fill="var(--color-Security)"
                stroke="var(--color-Security)"
                fillOpacity={0.4}
              />
            )}
            <Area
              dataKey="Protection"
              type="natural"
              fill="var(--color-Protection)"
              stroke="var(--color-Protection)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
