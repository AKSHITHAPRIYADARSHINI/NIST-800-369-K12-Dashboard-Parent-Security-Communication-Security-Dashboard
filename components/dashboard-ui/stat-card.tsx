"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "destructive"
  onClick?: () => void
}

const variantStyles = {
  default: "text-blue-600 dark:text-blue-400 border-l-blue-600",
  success: "text-green-600 dark:text-green-400 border-l-green-600",
  warning: "text-yellow-600 dark:text-yellow-400 border-l-yellow-600",
  destructive: "text-red-600 dark:text-red-400 border-l-red-600",
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
  onClick,
}: StatCardProps) {
  return (
    <Card
      className={`border-l-4 ${variantStyles[variant]} cursor-pointer transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`text-xs mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  )
}
