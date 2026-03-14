"use client"

import { TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  { month: "January", incidents: 186 },
  { month: "February", incidents: 205 },
  { month: "March", incidents: 137 },
  { month: "April", incidents: 73 },
  { month: "May", incidents: 109 },
  { month: "June", incidents: 114 },
]

const chartConfig = {
  incidents: {
    label: "Incidents",
    color: "#0c4a6e",
  },
} satisfies ChartConfig

export function ChartLineLinear() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Incident Trends</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 8,
              bottom: 8,
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="incidents"
              type="linear"
              stroke="#0c4a6e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-3">
        <div className="flex items-center gap-2 leading-none font-medium text-green-600">
          Trending down by 3.8% this month <TrendingDown className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Security incidents decreasing - positive trend
        </div>
      </CardFooter>
    </Card>
  )
}
