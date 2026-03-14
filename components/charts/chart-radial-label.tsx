"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

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
  { domain: "Identify", score: 95, fill: "#0c4a6e" },
  { domain: "Protect", score: 87, fill: "#1e40af" },
  { domain: "Detect", score: 78, fill: "#3b82f6" },
  { domain: "Respond", score: 82, fill: "#60a5fa" },
  { domain: "Recover", score: 91, fill: "#93c5fd" },
]

const chartConfig = {
  score: {
    label: "Score",
  },
  identify: {
    label: "Identify",
    color: "#0c4a6e",
  },
  protect: {
    label: "Protect",
    color: "#1e40af",
  },
  detect: {
    label: "Detect",
    color: "#3b82f6",
  },
  respond: {
    label: "Respond",
    color: "#60a5fa",
  },
  recover: {
    label: "Recover",
    color: "#93c5fd",
  },
} satisfies ChartConfig

export function ChartRadialLabel() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>NIST Framework Maturity</CardTitle>
        <CardDescription>Security function scores</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="domain" />}
            />
            <RadialBar dataKey="score" background>
              <LabelList
                position="insideStart"
                dataKey="domain"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Average score: 86.6% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          NIST Cybersecurity Framework maturity assessment
        </div>
      </CardFooter>
    </Card>
  )
}
