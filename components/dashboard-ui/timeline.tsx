"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineEvent {
  id: string | number
  title: string
  description?: string
  timestamp: string
  status?: "pending" | "completed" | "failed"
  icon?: React.ReactNode
}

interface TimelineProps {
  events: TimelineEvent[]
  title?: string
}

const statusStyles = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400",
  completed: "bg-green-100 dark:bg-green-900/30 border-green-400",
  failed: "bg-red-100 dark:bg-red-900/30 border-red-400",
}

export function Timeline({ events, title }: TimelineProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="relative space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-background" />
                {index !== events.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                    )}
                  </div>
                  {event.status && (
                    <Badge
                      variant={
                        event.status === "completed"
                          ? "default"
                          : event.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
