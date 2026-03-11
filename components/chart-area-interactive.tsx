"use client"

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

const chartData = [
  { date: "Jan 1", Compliance: 75, Security: 68, Protection: 72 },
  { date: "Jan 7", Compliance: 78, Security: 71, Protection: 75 },
  { date: "Jan 14", Compliance: 80, Security: 73, Protection: 77 },
  { date: "Jan 21", Compliance: 82, Security: 75, Protection: 79 },
  { date: "Jan 28", Compliance: 84, Security: 77, Protection: 81 },
  { date: "Feb 4", Compliance: 85, Security: 79, Protection: 83 },
  { date: "Feb 11", Compliance: 86, Security: 80, Protection: 84 },
  { date: "Feb 18", Compliance: 87, Security: 82, Protection: 85 },
  { date: "Feb 25", Compliance: 87, Security: 82, Protection: 86 },
]

export function ChartAreaInteractive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Posture Trend</CardTitle>
        <CardDescription>
          NIST 800-369 compliance, security, and data protection scores over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Compliance: { label: "Compliance Score", color: "hsl(var(--chart-1))" },
            Security: { label: "Security Score", color: "hsl(var(--chart-2))" },
            Protection: { label: "Protection Score", color: "hsl(var(--chart-3))" },
          }}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            data={chartData}
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
            <Area
              dataKey="Security"
              type="natural"
              fill="var(--color-Security)"
              stroke="var(--color-Security)"
              fillOpacity={0.4}
            />
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
