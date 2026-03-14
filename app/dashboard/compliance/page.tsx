"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function CompliancePage() {
  const [controls, setControls] = useState<any[]>([])
  const [score, setScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/controls").then(r => r.json()),
      fetch("/api/compliance/score").then(r => r.json()),
    ])
      .then(([controlsRes, scoreRes]) => {
        setControls(controlsRes.data || [])
        setScore(scoreRes.data || {})
      })
      .catch(err => toast.error("Failed to load compliance data"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-32 mb-4" />
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

  const summary = {
    done: controls.filter(c => c.status === "DONE").length,
    inProcess: controls.filter(c => c.status === "IN_PROCESS").length,
    notStarted: controls.filter(c => c.status === "NOT_STARTED").length,
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compliance & Controls</h1>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle>Overall Compliance Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold text-indigo-600">{score.overall || 0}</div>
          <div className="mt-4 flex gap-4">
            {score.domains?.map((d: any) => (
              <div key={d.domain} className="text-sm">
                <p className="font-medium">{d.domain}</p>
                <p className="text-lg font-bold">{Math.round(d.score)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{summary.done}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{summary.inProcess}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{summary.notStarted}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>NIST 800-369 Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Control ID</th>
                  <th className="text-left py-2 px-4">Title</th>
                  <th className="text-left py-2 px-4">Domain</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {controls.slice(0, 20).map((control) => (
                  <tr key={control.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{control.controlId}</td>
                    <td className="py-3 px-4">{control.title}</td>
                    <td className="py-3 px-4">{control.domain}</td>
                    <td className="py-3 px-4">
                      <Badge variant={control.status === "DONE" ? "default" : "secondary"}>
                        {control.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-gray-200 rounded h-2">
                        <div className="bg-blue-500 h-2 rounded" style={{ width: `${control.currentScore}%` }} />
                      </div>
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
