"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react"

interface ParentSecuritySummaryProps {
  complianceScore?: number
  protectionScore?: number
  lastIncidentDate?: string
  trustedVendors?: number
  totalVendors?: number
}

export function ParentSecuritySummary({
  complianceScore = 87,
  protectionScore = 94,
  lastIncidentDate = "2 weeks ago",
  trustedVendors = 18,
  totalVendors = 22,
}: ParentSecuritySummaryProps) {
  const vendorTrustPercentage = Math.round((trustedVendors / totalVendors) * 100)

  return (
    <div className="space-y-6">
      {/* Main Summary Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="size-4 text-green-600" />
        <AlertTitle>Your School's Data Protection Status</AlertTitle>
        <AlertDescription>
          We're actively protecting student data with security controls aligned to national cybersecurity standards.
          Last security review: {lastIncidentDate}.
        </AlertDescription>
      </Alert>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Security Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Security Compliance</CardTitle>
              <Shield className="size-5 text-blue-500" />
            </div>
            <CardDescription>Framework alignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Implementation Status</span>
                <span className="text-2xl font-bold text-blue-600">{complianceScore}%</span>
              </div>
              <Progress value={complianceScore} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              School has implemented {complianceScore}% of recommended security controls from national cybersecurity frameworks.
            </p>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Student Data Protection</CardTitle>
              <Lock className="size-5 text-green-500" />
            </div>
            <CardDescription>Encryption & access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Protection Level</span>
                <span className="text-2xl font-bold text-green-600">{protectionScore}%</span>
              </div>
              <Progress value={protectionScore} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              Student records are protected using encryption and access controls. Unauthorized access is prevented.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What We Protect */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How We Protect Your Student's Data</CardTitle>
          <CardDescription>
            Our security protections across critical areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Secure Login */}
            <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Lock className="size-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">Secure Login Systems</h4>
                <p className="text-sm text-muted-foreground">
                  Multi-factor authentication (MFA) prevents unauthorized access. Only authorized staff can access student accounts.
                </p>
              </div>
            </div>

            {/* Encrypted Data */}
            <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                <Shield className="size-5 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">Data Encryption</h4>
                <p className="text-sm text-muted-foreground">
                  Student records are encrypted both in storage and while moving over the internet. This prevents unauthorized viewing.
                </p>
              </div>
            </div>

            {/* Safe Platforms */}
            <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                <CheckCircle className="size-5 text-purple-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">Safe Learning Platforms</h4>
                <p className="text-sm text-muted-foreground">
                  All online learning platforms are regularly tested for security vulnerabilities. Updates are applied promptly.
                </p>
              </div>
            </div>

            {/* Vendor Security */}
            <div className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                <AlertTriangle className="size-5 text-orange-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">Vendor Security Reviews</h4>
                <p className="text-sm text-muted-foreground">
                  We review and audit all vendors who access student data. Currently {trustedVendors} of {totalVendors} vendors are approved.
                </p>
              </div>
            </div>

            {/* Threat Monitoring */}
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <Shield className="size-5 text-red-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">Continuous Threat Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  We monitor for suspicious activity 24/7. Security incidents are detected and responded to immediately.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Overall Security Posture</span>
              <Badge>Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Security Audit</span>
              <span className="text-sm text-muted-foreground">1 week ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Open Security Issues</span>
              <Badge variant="secondary">2 low priority</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Approved Vendors</span>
              <span className="text-sm text-muted-foreground">{trustedVendors}/{totalVendors}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
