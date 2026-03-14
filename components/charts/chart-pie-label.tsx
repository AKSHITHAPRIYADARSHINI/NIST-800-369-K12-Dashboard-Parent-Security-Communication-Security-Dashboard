"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
  { control: "Technical", controls: 275, fill: "#0c4a6e" },
  { control: "Administrative", controls: 200, fill: "#1e40af" },
  { control: "Physical", controls: 187, fill: "#3b82f6" },
  { control: "Legal", controls: 173, fill: "#60a5fa" },
  { control: "Planning", controls: 90, fill: "#93c5fd" },
]

const chartConfig = {
  controls: {
    label: "Controls",
  },
  technical: {
    label: "Technical",
    color: "#0c4a6e",
  },
  administrative: {
    label: "Administrative",
    color: "#1e40af",
  },
  physical: {
    label: "Physical",
    color: "#3b82f6",
  },
  legal: {
    label: "Legal",
    color: "#60a5fa",
  },
  planning: {
    label: "Planning",
    color: "#93c5fd",
  },
} satisfies ChartConfig

export function ChartPieLabel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Control Types Distribution</CardTitle>
        <CardDescription>Security controls by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="controls" label nameKey="control" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          25 controls implemented <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          NIST 800-369 security control distribution
        </div>
      </CardFooter>
    </Card>
  )
}
