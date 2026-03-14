"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface AlertCardProps {
  id?: string
  title: string
  description?: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  timestamp?: string
  action?: () => void
}

const severityConfig = {
  critical: {
    icon: <AlertCircle className="h-5 w-5" />,
    bgColor: "bg-red-50 dark:bg-red-950/30 border-l-red-600",
    badgeVariant: "destructive",
    textColor: "text-red-700 dark:text-red-300",
  },
  high: {
    icon: <AlertTriangle className="h-5 w-5" />,
    bgColor: "bg-orange-50 dark:bg-orange-950/30 border-l-orange-600",
    badgeVariant: "default",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  medium: {
    icon: <AlertTriangle className="h-5 w-5" />,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30 border-l-yellow-600",
    badgeVariant: "secondary",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  low: {
    icon: <Info className="h-5 w-5" />,
    bgColor: "bg-blue-50 dark:bg-blue-950/30 border-l-blue-600",
    badgeVariant: "secondary",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  info: {
    icon: <CheckCircle className="h-5 w-5" />,
    bgColor: "bg-green-50 dark:bg-green-950/30 border-l-green-600",
    badgeVariant: "secondary",
    textColor: "text-green-700 dark:text-green-300",
  },
}

export function AlertCard({
  id,
  title,
  description,
  severity,
  timestamp,
  action,
}: AlertCardProps) {
  const config = severityConfig[severity]

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${config.bgColor} cursor-pointer transition-all hover:shadow-md`}
      onClick={action}
    >
      <div className={`flex-shrink-0 ${config.textColor}`}>{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm">{title}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <Badge variant={config.badgeVariant as any}>{severity.toUpperCase()}</Badge>
        </div>
        {timestamp && <p className="text-xs text-muted-foreground mt-2">{timestamp}</p>}
      </div>
    </div>
  )
}
