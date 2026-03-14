"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [riskOnly, setRiskOnly] = useState(false)

  useEffect(() => {
    const url = `/api/access-logs?page=${page}&limit=50${riskOnly ? "&riskOnly=true" : ""}`
    fetch(url)
      .then(r => r.json())
      .then(json => setLogs(json.data || []))
      .catch(err => toast.error("Failed to load logs"))
      .finally(() => setLoading(false))
  }, [page, riskOnly])

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
      <h1 className="text-3xl font-bold">Access Logs</h1>

      <div className="flex gap-2">
        <Button
          variant={!riskOnly ? "default" : "outline"}
          onClick={() => { setRiskOnly(false); setPage(1); }}
        >
          All Access
        </Button>
        <Button
          variant={riskOnly ? "default" : "outline"}
          onClick={() => { setRiskOnly(true); setPage(1); }}
        >
          Risk Alerts Only
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Log Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-2">Timestamp</th>
                  <th className="text-left py-2 px-2">User</th>
                  <th className="text-left py-2 px-2">Role</th>
                  <th className="text-left py-2 px-2">Action</th>
                  <th className="text-left py-2 px-2">Resource</th>
                  <th className="text-left py-2 px-2">Result</th>
                  <th className="text-left py-2 px-2">IP Address</th>
                  <th className="text-left py-2 px-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className={`border-b hover:bg-gray-50 ${log.riskFlag ? "bg-red-50" : ""}`}>
                    <td className="py-2 px-2 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-2">{log.userEmail}</td>
                    <td className="py-2 px-2">{log.userRole}</td>
                    <td className="py-2 px-2">{log.action}</td>
                    <td className="py-2 px-2 text-xs">{log.resource}</td>
                    <td className="py-2 px-2">
                      <Badge variant={log.result === "SUCCESS" ? "default" : "destructive"} className="text-xs">
                        {log.result}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-xs font-mono">{log.ipAddress || "N/A"}</td>
                    <td className="py-2 px-2">
                      {log.riskFlag && (
                        <Badge variant="destructive" className="text-xs">⚠ Flag</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 mt-4 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">Page {page}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={logs.length < 50}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
