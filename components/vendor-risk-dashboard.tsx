"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Clock } from "lucide-react"

interface Vendor {
  id: number
  name: string
  riskScore: number
  status: "Approved" | "Under Review" | "At Risk"
  lastAssessment: string
  dataAccess: string[]
}

interface VendorRiskDashboardProps {
  vendors?: Vendor[]
}

const DEFAULT_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Google Workspace",
    riskScore: 95,
    status: "Approved",
    lastAssessment: "1 week ago",
    dataAccess: ["Email", "Documents", "Calendar"],
  },
  {
    id: 2,
    name: "Microsoft Teams",
    riskScore: 93,
    status: "Approved",
    lastAssessment: "2 weeks ago",
    dataAccess: ["Communication", "Collaboration"],
  },
  {
    id: 3,
    name: "Classroom Management App",
    riskScore: 78,
    status: "Under Review",
    lastAssessment: "5 days ago",
    dataAccess: ["Grades", "Attendance", "Student Profiles"],
  },
  {
    id: 4,
    name: "Online Testing Platform",
    riskScore: 85,
    status: "Approved",
    lastAssessment: "3 days ago",
    dataAccess: ["Test Results", "Student Performance"],
  },
  {
    id: 5,
    name: "Library Management System",
    riskScore: 72,
    status: "At Risk",
    lastAssessment: "10 days ago",
    dataAccess: ["Borrowing Records", "Student Names"],
  },
  {
    id: 6,
    name: "Learning Management System",
    riskScore: 88,
    status: "Approved",
    lastAssessment: "1 week ago",
    dataAccess: ["Course Materials", "Grades", "Submissions"],
  },
]

function getRiskColor(riskScore: number): string {
  if (riskScore >= 90) return "text-green-600"
  if (riskScore >= 75) return "text-yellow-600"
  return "text-red-600"
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Approved":
      return <CheckCircle className="size-4 text-green-500" />
    case "Under Review":
      return <Clock className="size-4 text-yellow-500" />
    case "At Risk":
      return <AlertTriangle className="size-4 text-red-500" />
    default:
      return null
  }
}

function getStatusColor2(status: string): "default" | "secondary" | "destructive" {
  switch (status) {
    case "Approved":
      return "default"
    case "Under Review":
      return "secondary"
    case "At Risk":
      return "destructive"
    default:
      return "secondary"
  }
}

export function VendorRiskDashboard({ vendors = DEFAULT_VENDORS }: VendorRiskDashboardProps) {
  const approvedCount = vendors.filter((v) => v.status === "Approved").length
  const underReviewCount = vendors.filter((v) => v.status === "Under Review").length
  const atRiskCount = vendors.filter((v) => v.status === "At Risk").length

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Security verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Assessment in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{atRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Alert */}
      {atRiskCount > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            {atRiskCount} vendor(s) require security attention. Review recommendations below.
          </AlertDescription>
        </Alert>
      )}

      {/* Vendor Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Security Assessment</CardTitle>
          <CardDescription>
            Third-party services and their security review status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(vendor.status)}
                    <h4 className="font-medium text-sm">{vendor.name}</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Data access: {vendor.dataAccess.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last assessment: {vendor.lastAssessment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right space-y-2">
                    <div className={`text-2xl font-bold ${getRiskColor(vendor.riskScore)}`}>
                      {vendor.riskScore}
                    </div>
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                  </div>
                  <Badge variant={getStatusColor2(vendor.status)}>
                    {vendor.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vendor Security Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b">
            <CheckCircle className="size-4 text-green-500 shrink-0" />
            <span className="text-sm">All vendors have current security assessments</span>
          </div>
          <div className="flex items-center gap-3 pb-3 border-b">
            <CheckCircle className="size-4 text-green-500 shrink-0" />
            <span className="text-sm">Contracts include data security requirements</span>
          </div>
          <div className="flex items-center gap-3 pb-3 border-b">
            <AlertTriangle className="size-4 text-yellow-500 shrink-0" />
            <span className="text-sm">1 vendor pending security update</span>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-4 text-red-500 shrink-0" />
            <span className="text-sm">1 vendor requires remediation plan</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
