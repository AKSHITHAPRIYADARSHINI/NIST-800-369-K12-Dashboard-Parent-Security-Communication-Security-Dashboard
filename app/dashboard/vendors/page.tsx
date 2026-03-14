"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function VendorsPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Vendor Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vendors.filter(v => v.riskStatus === "APPROVED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {vendors.filter(v => v.riskStatus === "UNDER_REVIEW").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {vendors.filter(v => v.riskStatus === "AT_RISK").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Vendor</th>
                  <th className="text-left py-2 px-4">Service</th>
                  <th className="text-left py-2 px-4">Data Sensitivity</th>
                  <th className="text-left py-2 px-4">Risk Status</th>
                  <th className="text-left py-2 px-4">Contract</th>
                  <th className="text-left py-2 px-4">Risk Rating</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{vendor.name}</td>
                    <td className="py-3 px-4">{vendor.service}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{vendor.dataSensitivity}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={vendor.riskStatus === "APPROVED" ? "default" : vendor.riskStatus === "AT_RISK" ? "destructive" : "secondary"}>
                        {vendor.riskStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={vendor.contractStatus === "ACTIVE" ? "default" : "outline"}>
                        {vendor.contractStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={vendor.riskRating === "LOW" ? "secondary" : vendor.riskRating === "HIGH" ? "destructive" : "outline"}>
                        {vendor.riskRating}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
