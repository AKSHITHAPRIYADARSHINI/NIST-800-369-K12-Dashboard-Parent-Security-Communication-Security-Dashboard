"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, TrendingUp, AlertTriangle } from "lucide-react"
import { getAllDomainSummaries, getOverallComplianceScore } from "@/lib/nist-controls-mapping"

export function ComplianceScorer() {
  const domainSummaries = getAllDomainSummaries()
  const overallScore = getOverallComplianceScore()

  const scoreInterpretation = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (score >= 75) return { label: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (score >= 60) return { label: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { label: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const interpretation = scoreInterpretation(overallScore)

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className={interpretation.bgColor}>
        <CardHeader>
          <CardTitle>Overall Cybersecurity Compliance Score</CardTitle>
          <CardDescription>
            Percentage of NIST-800-369 controls implemented across all domains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-end gap-6">
            <div className="flex-1">
              <div className={`text-6xl font-bold ${interpretation.color}`}>
                {overallScore}%
              </div>
              <p className={`text-sm mt-2 font-medium ${interpretation.color}`}>
                Status: {interpretation.label}
              </p>
            </div>
            <div className="flex-1">
              <Progress value={overallScore} className="h-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {domainSummaries.reduce((sum, d) => sum + d.implemented, 0)} of{" "}
                {domainSummaries.reduce((sum, d) => sum + d.total, 0)} controls implemented
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {overallScore < 75 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Improvement Areas Identified</AlertTitle>
          <AlertDescription>
            Focus on completing partial implementations in Device Security and Vendor Management domains.
          </AlertDescription>
        </Alert>
      )}

      {overallScore >= 75 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Strong Compliance Foundation</AlertTitle>
          <AlertDescription className="text-green-700">
            The school maintains good alignment with national cybersecurity standards. Focus efforts on
            optimizing existing controls and addressing remaining gaps.
          </AlertDescription>
        </Alert>
      )}

      {/* Domain Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Compliance Breakdown</CardTitle>
          <CardDescription>Implementation status by security domain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {domainSummaries.map((domain) => (
            <div key={domain.domain} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{domain.domain}</h4>
                  <p className="text-xs text-muted-foreground">
                    {domain.implemented} of {domain.total} controls
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{domain.implementationPercentage}%</div>
                  <p className="text-xs text-muted-foreground">Level {domain.averageMaturity}/4</p>
                </div>
              </div>
              <Progress value={domain.implementationPercentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Maturity Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Maturity Assessment</CardTitle>
          <CardDescription>Average maturity level by domain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domainSummaries.map((domain) => {
              const maturityLabels = [
                "Not Started",
                "Planned",
                "Partial",
                "Implemented",
                "Optimized",
              ]
              const maturityColors = [
                "bg-red-100 text-red-700",
                "bg-blue-100 text-blue-700",
                "bg-yellow-100 text-yellow-700",
                "bg-green-100 text-green-700",
                "bg-green-200 text-green-800",
              ]

              return (
                <div key={domain.domain} className="border rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-3">{domain.domain}</h4>
                  <div className="flex items-end gap-3">
                    <div
                      className={`text-4xl font-bold px-4 py-2 rounded ${maturityColors[domain.averageMaturity]}`}
                    >
                      {domain.averageMaturity}
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium">
                        {maturityLabels[domain.averageMaturity]}
                      </p>
                      <p className="text-muted-foreground">
                        Avg. Level
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Improvement Roadmap</CardTitle>
          <CardDescription>Recommended priorities for the next 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                priority: "1. Immediate",
                items: [
                  "Complete Device Security patch management implementation",
                  "Finalize Vendor Security assessments for remaining 18% of vendors",
                ],
                color: "border-red-200 bg-red-50",
              },
              {
                priority: "2. Near-term (30 days)",
                items: [
                  "Enhance Data Protection with student data classification procedures",
                  "Expand continuous compliance monitoring to remaining systems",
                ],
                color: "border-yellow-200 bg-yellow-50",
              },
              {
                priority: "3. Medium-term (60 days)",
                items: [
                  "Optimize all implemented controls with monitoring and review processes",
                  "Complete business continuity and disaster recovery testing",
                ],
                color: "border-blue-200 bg-blue-50",
              },
            ].map((section, idx) => (
              <div key={idx} className={`border-l-4 rounded p-4 ${section.color}`}>
                <h4 className="font-medium text-sm mb-2">{section.priority}</h4>
                <ul className="text-sm space-y-1">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs flex gap-2">
                      <span className="text-blue-600">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              Best Performing Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {
                domainSummaries.reduce((best, d) =>
                  d.implementationPercentage > best.implementationPercentage ? d : best
                ).domain
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.max(...domainSummaries.map((d) => d.implementationPercentage))}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="size-4 text-yellow-600" />
              Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {
                domainSummaries.reduce((lowest, d) =>
                  d.implementationPercentage < lowest.implementationPercentage ? d : lowest
                ).domain
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.min(...domainSummaries.map((d) => d.implementationPercentage))}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="size-4 text-blue-600" />
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {domainSummaries.reduce((sum, d) => sum + d.total, 0)}
            </p>
            <p className="text-xs text-muted-foreground">
              Across {domainSummaries.length} domains
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
