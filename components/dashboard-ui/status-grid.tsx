"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatusItem {
  label: string
  count: number
  status: "success" | "warning" | "danger" | "neutral"
  icon?: React.ReactNode
}

interface StatusGridProps {
  title: string
  items: StatusItem[]
}

const statusStyles = {
  success: "bg-green-50 dark:bg-green-900/20 border-l-green-600 text-green-700 dark:text-green-300",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-600 text-yellow-700 dark:text-yellow-300",
  danger: "bg-red-50 dark:bg-red-900/20 border-l-red-600 text-red-700 dark:text-red-300",
  neutral: "bg-gray-50 dark:bg-gray-900/20 border-l-gray-600 text-gray-700 dark:text-gray-300",
}

export function StatusGrid({ title, items }: StatusGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className={`p-4 rounded-lg border-l-4 ${statusStyles[item.status]} flex flex-col items-center text-center`}
            >
              {item.icon && <div className="text-2xl mb-2">{item.icon}</div>}
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
