"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ScorecardProps {
  title: string
  score: number
  maxScore?: number
  description?: string
  status?: "excellent" | "good" | "fair" | "poor"
  breakdown?: Array<{
    label: string
    value: number
  }>
}

function getScoreColor(score: number, maxScore: number = 100): string {
  const percentage = (score / maxScore) * 100
  if (percentage >= 80) return "text-green-600 dark:text-green-400"
  if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400"
  if (percentage >= 40) return "text-orange-600 dark:text-orange-400"
  return "text-red-600 dark:text-red-400"
}

function getStatusBadge(score: number, maxScore: number = 100) {
  const percentage = (score / maxScore) * 100
  if (percentage >= 80) return { label: "Excellent", variant: "default" }
  if (percentage >= 60) return { label: "Good", variant: "secondary" }
  if (percentage >= 40) return { label: "Fair", variant: "outline" }
  return { label: "Poor", variant: "destructive" }
}

export function Scorecard({
  title,
  score,
  maxScore = 100,
  description,
  breakdown,
}: ScorecardProps) {
  const status = getStatusBadge(score, maxScore)
  const colorClass = getScoreColor(score, maxScore)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <Badge variant={status.variant as any}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <div className={`text-2xl font-bold ${colorClass}`}>{score}</div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600"></div>
          </div>
          <div className="flex-1 text-sm">
            <p className="text-muted-foreground">
              {score} / {maxScore}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((score / maxScore) * 100)}% Complete
            </p>
          </div>
        </div>

        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            {breakdown.map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
