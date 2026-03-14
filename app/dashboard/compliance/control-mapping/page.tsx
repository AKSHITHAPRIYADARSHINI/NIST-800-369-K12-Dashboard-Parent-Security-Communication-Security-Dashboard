"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ControlMappingPage() {
  const [controls, setControls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("")

  useEffect(() => {
    fetch("/api/controls")
      .then(r => r.json())
      .then(json => setControls(json.data || []))
      .catch(err => toast.error("Failed to load controls"))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateStatus = async (controlId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/controls/${controlId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update control")
      toast.success("Control updated")
      setControls(controls.map(c => c.id === controlId ? { ...c, status: newStatus } : c))
    } catch (err) {
      toast.error(String(err))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-20" />
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

  const filtered = controls.filter(c => !filter || c.status === filter)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">NIST Control Mapping</h1>

      <div className="flex gap-2">
        <Button
          variant={!filter ? "default" : "outline"}
          onClick={() => setFilter("")}
        >
          All ({controls.length})
        </Button>
        <Button
          variant={filter === "DONE" ? "default" : "outline"}
          onClick={() => setFilter("DONE")}
        >
          Done ({controls.filter(c => c.status === "DONE").length})
        </Button>
        <Button
          variant={filter === "IN_PROCESS" ? "default" : "outline"}
          onClick={() => setFilter("IN_PROCESS")}
        >
          In Progress ({controls.filter(c => c.status === "IN_PROCESS").length})
        </Button>
        <Button
          variant={filter === "NOT_STARTED" ? "default" : "outline"}
          onClick={() => setFilter("NOT_STARTED")}
        >
          Not Started ({controls.filter(c => c.status === "NOT_STARTED").length})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">ID</th>
                  <th className="text-left py-2 px-4">Title</th>
                  <th className="text-left py-2 px-4">Domain</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Score</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((control) => (
                  <tr key={control.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{control.controlId}</td>
                    <td className="py-3 px-4 font-medium">{control.title}</td>
                    <td className="py-3 px-4 text-xs">{control.domain}</td>
                    <td className="py-3 px-4">
                      <Badge variant={control.status === "DONE" ? "default" : control.status === "IN_PROCESS" ? "secondary" : "outline"}>
                        {control.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 bg-gray-200 rounded h-2">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${control.currentScore}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={control.status}
                        onChange={(e) => handleUpdateStatus(control.id, e.target.value)}
                      >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROCESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
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
