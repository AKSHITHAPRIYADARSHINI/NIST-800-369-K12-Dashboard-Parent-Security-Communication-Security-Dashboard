"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
  title: string
  current: number
  total: number
  description?: string
  showPercentage?: boolean
  color?: "blue" | "green" | "red" | "yellow"
}

const colorStyles = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
}

export function ProgressCard({
  title,
  current,
  total,
  description,
  showPercentage = true,
  color = "blue",
}: ProgressCardProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {showPercentage && <span className="text-sm font-bold text-muted-foreground">{percentage}%</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {current} of {total} {description}
        </p>
      </CardContent>
    </Card>
  )
}
