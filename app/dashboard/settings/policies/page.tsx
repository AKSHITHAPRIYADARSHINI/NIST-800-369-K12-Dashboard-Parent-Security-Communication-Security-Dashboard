"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/policies")
      .then(r => r.json())
      .then(json => setPolicies(json.data || []))
      .catch(err => toast.error("Failed to load policies"))
      .finally(() => setLoading(false))
  }, [])

  const handleArchive = async (policyId: string) => {
    try {
      const res = await fetch(`/api/policies/${policyId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to archive policy")
      toast.success("Policy archived")
      setPolicies(policies.filter(p => p.id !== policyId))
    } catch (err) {
      toast.error(String(err))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-10 w-20" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between items-start p-3 border rounded">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-60 mb-2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-3 w-32 mb-2" />
                      <Skeleton className="h-3 w-32 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const categories = [...new Set(policies.map(p => p.category))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Security Policies</h1>
        <Button>Create Policy</Button>
      </div>

      {categories.map((category) => {
        const categoryPolicies = policies.filter(p => p.category === category)
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{category.replace(/_/g, " ")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryPolicies.map((policy) => (
                  <div key={policy.id} className="flex justify-between items-start p-3 border rounded hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-bold">{policy.name}</h3>
                      <p className="text-sm text-gray-600">{policy.summary}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">v{policy.version}</Badge>
                        <Badge variant={policy.status === "ACTIVE" ? "default" : "secondary"}>
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Owner: {policy.owner}</p>
                      <p className="text-xs text-gray-600 mb-2">
                        Review: {new Date(policy.nextReview).toLocaleDateString()}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleArchive(policy.id)}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
