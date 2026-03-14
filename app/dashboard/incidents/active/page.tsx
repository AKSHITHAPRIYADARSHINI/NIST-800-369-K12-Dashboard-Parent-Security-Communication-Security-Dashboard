"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ActiveIncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/incidents?status=OPEN")
      .then(r => r.json())
      .then(json => setIncidents(json.data || []))
      .catch(err => toast.error("Failed to load incidents"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateStatus = async (incidentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update incident")
      toast.success("Incident updated")
      setIncidents(incidents.filter(i => i.id !== incidentId))
    } catch (err) {
      toast.error(String(err))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  const stats = {
    critical: incidents.filter(i => i.severity === "CRITICAL").length,
    high: incidents.filter(i => i.severity === "HIGH").length,
    investigating: incidents.filter(i => i.status === "INVESTIGATING").length,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Active Incidents</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{incidents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.investigating}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">{incident.title}</h3>
                  <p className="text-sm text-gray-600">{incident.type}</p>
                </div>
                <Badge variant={incident.severity === "CRITICAL" ? "destructive" : "secondary"}>
                  {incident.severity}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Assignee: {incident.assignee || "Unassigned"}</span>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(incident.id, "INVESTIGATING")}
                  >
                    Investigate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(incident.id, "RESOLVED")}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {incidents.length === 0 && (
            <p className="text-center text-gray-600 py-8">No active incidents</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
