"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function VendorAssessmentPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/vendors")
      .then(r => r.json())
      .then(json => setVendors(json.data || []))
      .catch(err => toast.error("Failed to load vendors"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-24" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vendor Security Assessments</h1>

      <div className="space-y-4">
        {vendors.map((vendor) => {
          const assessment = vendor.assessment
          const assessmentScore = assessment?.overallScore || 0
          return (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vendor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{vendor.service}</p>
                  </div>
                  <Badge variant={vendor.riskStatus === "APPROVED" ? "default" : "destructive"}>
                    {vendor.riskStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Overall Score</p>
                    <p className="text-2xl font-bold">{Math.round(assessmentScore)}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={assessment?.ferpaCompliant ? "default" : "outline"}>
                      {assessment?.ferpaCompliant ? "✓ FERPA" : "FERPA"}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={assessment?.coppaCompliant ? "default" : "outline"}>
                      {assessment?.coppaCompliant ? "✓ COPPA" : "COPPA"}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={assessment?.soc2Certified ? "default" : "outline"}>
                      {assessment?.soc2Certified ? "✓ SOC2" : "SOC2"}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={assessment?.penetrationTested ? "default" : "outline"}>
                      {assessment?.penetrationTested ? "✓ Pen Test" : "Pen Test"}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Badge variant={assessment?.dataEncryption ? "default" : "outline"}>
                      {assessment?.dataEncryption ? "✓ Encrypted" : "Encrypted"}
                    </Badge>
                  </div>
                </div>

                {assessment?.nextReview && (
                  <div className="mt-4 text-sm">
                    <p className="text-gray-600">Next Review: {new Date(assessment.nextReview).toLocaleDateString()}</p>
                    <p className="text-gray-600">Recommendation: <span className="font-medium">{assessment.recommendation}</span></p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
