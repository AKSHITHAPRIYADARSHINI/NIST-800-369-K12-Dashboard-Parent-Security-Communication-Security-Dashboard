"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, Zap } from "lucide-react"
import type { SecurityMetrics } from "@/lib/nist-mock-data"

interface SectionCardsProps {
  metrics?: SecurityMetrics
  lastUpdated?: Date
}

export function SectionCards({
  metrics = { compliance: 87, protection: 94, authentication: 78, incidentResponse: 82 },
  lastUpdated
}: SectionCardsProps) {
  const showAuthenticationCard = metrics.authentication > 0
  const showIncidentResponseCard = metrics.incidentResponse > 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Overall Compliance Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.compliance}%
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Badge variant="outline">
              <TrendingUpIcon />
              +5.2%
            </Badge>
            {lastUpdated && <Zap className="size-3 text-yellow-500" />}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            NIST 800-369 framework compliance
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Student Data Protection</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.protection}%
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Badge variant="outline">
              <TrendingUpIcon />
              +2.1%
            </Badge>
            {lastUpdated && <Zap className="size-3 text-yellow-500" />}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Encryption & Access Controls <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Data protection measures implemented
          </div>
        </CardFooter>
      </Card>

      {showAuthenticationCard && (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Authentication Security</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.authentication}%
            </CardTitle>
            <CardAction className="flex items-center gap-2">
              <Badge variant="outline">
                <TrendingDownIcon />
                -1.3%
              </Badge>
              {lastUpdated && <Zap className="size-3 text-yellow-500" />}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              MFA Coverage & Access <TrendingDownIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Multi-factor authentication adoption
            </div>
          </CardFooter>
        </Card>
      )}

      {showIncidentResponseCard && (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Incident Response Readiness</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metrics.incidentResponse}%
            </CardTitle>
            <CardAction className="flex items-center gap-2">
              <Badge variant="outline">
                <TrendingUpIcon />
                +3.5%
              </Badge>
              {lastUpdated && <Zap className="size-3 text-yellow-500" />}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Detection & Response <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Security incident preparedness
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
