"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", security: 186, protection: 80 },
  { month: "February", security: 305, protection: 200 },
  { month: "March", security: 237, protection: 120 },
  { month: "April", security: 273, protection: 190 },
  { month: "May", security: 309, protection: 130 },
  { month: "June", security: 314, protection: 140 },
]

const chartConfig = {
  security: {
    label: "Security Score",
    color: "#1e40af",
  },
  protection: {
    label: "Protection Score",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function ChartAreaStacked() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Protection</CardTitle>
        <CardDescription>
          Showing security and protection scores for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="protection"
              type="natural"
              fill="#60a5fa"
              fillOpacity={0.4}
              stroke="#60a5fa"
              stackId="a"
            />
            <Area
              dataKey="security"
              type="natural"
              fill="#1e40af"
              fillOpacity={0.4}
              stroke="#1e40af"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
