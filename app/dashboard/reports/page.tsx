"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ReportsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(`/api/access-logs?page=${page}&limit=20`)
      .then(r => r.json())
      .then(json => setLogs(json.data || []))
      .catch(err => toast.error("Failed to load access logs"))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Access & Audit Reports</h1>

      <div className="flex gap-2">
        <Button variant={logs.filter(l => l.riskFlag).length === 0 ? "default" : "outline"}>
          All Access
        </Button>
        <Button variant="outline">
          Risk Alerts ({logs.filter(l => l.riskFlag).length})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Timestamp</th>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Action</th>
                  <th className="text-left py-2 px-4">Resource</th>
                  <th className="text-left py-2 px-4">Result</th>
                  <th className="text-left py-2 px-4">Risk</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">{log.userEmail}</td>
                    <td className="py-3 px-4">{log.action}</td>
                    <td className="py-3 px-4 text-xs">{log.resource}</td>
                    <td className="py-3 px-4">
                      <Badge variant={log.result === "SUCCESS" ? "default" : "destructive"}>
                        {log.result}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={log.riskFlag ? "destructive" : "secondary"}>
                        {log.riskFlag ? "⚠ Flag" : "OK"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="py-2">Page {page}</span>
            <Button onClick={() => setPage(p => p + 1)} disabled={logs.length < 20}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
