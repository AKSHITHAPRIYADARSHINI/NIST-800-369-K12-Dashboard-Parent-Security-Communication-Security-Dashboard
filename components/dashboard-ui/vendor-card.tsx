"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface VendorCardProps {
  name: string
  category: string
  riskScore: number
  status: "approved" | "monitoring" | "restricted"
  certifications?: string[]
  lastAudit?: string
}

const statusConfig = {
  approved: {
    badgeVariant: "default",
    color: "bg-green-600",
    label: "Approved",
  },
  monitoring: {
    badgeVariant: "secondary",
    color: "bg-yellow-600",
    label: "Monitoring",
  },
  restricted: {
    badgeVariant: "destructive",
    color: "bg-red-600",
    label: "Restricted",
  },
}

export function VendorCard({
  name,
  category,
  riskScore,
  status,
  certifications,
  lastAudit,
}: VendorCardProps) {
  const config = statusConfig[status]
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low"

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-sm">{name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{category}</p>
          </div>
          <Badge variant={config.badgeVariant as any}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Risk Score</span>
            <span className="font-bold">{riskScore}</span>
          </div>
          <Progress value={riskScore} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">{riskLevel} Risk</p>
        </div>

        {certifications && certifications.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium">Certifications:</p>
            <div className="flex flex-wrap gap-1">
              {certifications.map((cert) => (
                <Badge key={cert} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {lastAudit && (
          <p className="text-xs text-muted-foreground border-t pt-2">Last Audit: {lastAudit}</p>
        )}
      </CardContent>
    </Card>
  )
}
