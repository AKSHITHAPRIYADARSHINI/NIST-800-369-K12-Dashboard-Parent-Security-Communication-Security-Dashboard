"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { date: "2024-04-01", systems: 222, devices: 150 },
  { date: "2024-04-02", systems: 297, devices: 180 },
  { date: "2024-04-03", systems: 267, devices: 120 },
  { date: "2024-04-04", systems: 242, devices: 260 },
  { date: "2024-04-05", systems: 373, devices: 290 },
  { date: "2024-04-06", systems: 301, devices: 340 },
  { date: "2024-04-07", systems: 245, devices: 180 },
  { date: "2024-04-08", systems: 409, devices: 320 },
  { date: "2024-04-09", systems: 259, devices: 110 },
  { date: "2024-04-10", systems: 261, devices: 190 },
  { date: "2024-04-11", systems: 327, devices: 350 },
  { date: "2024-04-12", systems: 292, devices: 210 },
  { date: "2024-04-13", systems: 342, devices: 380 },
  { date: "2024-04-14", systems: 337, devices: 220 },
  { date: "2024-04-15", systems: 320, devices: 170 },
  { date: "2024-04-16", systems: 338, devices: 190 },
  { date: "2024-04-17", systems: 446, devices: 360 },
  { date: "2024-04-18", systems: 364, devices: 410 },
  { date: "2024-04-19", systems: 243, devices: 180 },
  { date: "2024-04-20", systems: 289, devices: 150 },
  { date: "2024-04-21", systems: 337, devices: 200 },
  { date: "2024-04-22", systems: 224, devices: 170 },
  { date: "2024-04-23", systems: 338, devices: 230 },
  { date: "2024-04-24", systems: 387, devices: 290 },
  { date: "2024-04-25", systems: 215, devices: 250 },
  { date: "2024-04-26", systems: 275, devices: 130 },
  { date: "2024-04-27", systems: 383, devices: 420 },
  { date: "2024-04-28", systems: 222, devices: 180 },
  { date: "2024-04-29", systems: 315, devices: 240 },
  { date: "2024-04-30", systems: 454, devices: 380 },
]

const chartConfig = {
  views: {
    label: "Security Assessments",
  },
  systems: {
    label: "Systems",
    color: "#1e3a8a",
  },
  devices: {
    label: "Devices",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("systems")

  const total = React.useMemo(
    () => ({
      systems: chartData.reduce((acc, curr) => acc + curr.systems, 0),
      devices: chartData.reduce((acc, curr) => acc + curr.devices, 0),
    }),
    []
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Systems & Devices</CardTitle>
          <CardDescription>
            Security assessment metrics for the last month
          </CardDescription>
        </div>
        <div className="flex">
          {["systems", "devices"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
