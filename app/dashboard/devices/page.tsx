"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { StatCard, StatusGrid, ProgressCard } from "@/components/dashboard-ui"
import { Smartphone, Activity, AlertTriangle, CheckCircle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/devices")
      const json = await res.json()
      setDevices(json.data || [])
    } catch (err) {
      toast.error("Failed to load devices")
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/devices/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to archive device")
      toast.success("Device archived")
      fetchDevices()
    } catch (err) {
      toast.error(String(err))
    }
  }

  // Calculate device statistics
  const compliantDevices = devices.filter(d => d.patchStatus === "CURRENT" && d.encryptionStatus === "ENABLED").length
  const atRiskDevices = devices.filter(d => d.riskLevel === "HIGH" || d.riskLevel === "CRITICAL").length
  const patchedDevices = devices.filter(d => d.patchStatus === "CURRENT").length
  const patchingPercentage = devices.length > 0 ? Math.round((patchedDevices / devices.length) * 100) : 0

  // Device type distribution
  const deviceTypeData = devices.reduce((acc: any, device: any) => {
    const type = device.type || "Unknown"
    const existing = acc.find((t: any) => t.name === type)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: type, value: 1 })
    }
    return acc
  }, [])

  const typeColors: any = {
    Laptop: "#3b82f6",
    Desktop: "#0ea5e9",
    Mobile: "#06b6d4",
    Tablet: "#10b981",
    Server: "#8b5cf6",
    Unknown: "#6b7280",
  }

  const encryptionData = [
    {
      name: "Encrypted",
      value: devices.filter(d => d.encryptionStatus === "ENABLED").length,
      fill: "#10b981",
    },
    {
      name: "Not Encrypted",
      value: devices.filter(d => d.encryptionStatus === "DISABLED").length,
      fill: "#ef4444",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-10 w-20" />
        </div>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Device Management</h1>
          <p className="text-muted-foreground mt-2">Manage devices and monitor security compliance</p>
        </div>
        <Button>Add Device</Button>
      </div>

      {/* Device Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Devices"
          value={devices.length}
          description="Managed endpoints"
          icon={<Smartphone className="h-6 w-6" />}
          variant="default"
        />

        <StatCard
          title="Compliant"
          value={compliantDevices}
          description={`${Math.round((compliantDevices / devices.length) * 100)}% of devices`}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />

        <StatCard
          title="At Risk"
          value={atRiskDevices}
          description="High/Critical severity"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
          trend={{ value: 2, isPositive: false }}
        />

        <ProgressCard
          title="Patch Coverage"
          current={patchedDevices}
          total={devices.length}
          description="devices patched"
          color="blue"
        />
      </div>

      {/* Device Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Type Distribution</CardTitle>
            <CardDescription>Breakdown by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceTypeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={typeColors[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Encryption Status</CardTitle>
            <CardDescription>Device encryption compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={encryptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6">
                  {encryptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Compliance Status Grid */}
      <StatusGrid
        title="Patch & Encryption Status"
        items={[
          {
            label: "Patched",
            count: patchedDevices,
            status: "success",
          },
          {
            label: "Outdated",
            count: devices.filter(d => d.patchStatus !== "CURRENT").length,
            status: "danger",
          },
          {
            label: "Encrypted",
            count: devices.filter(d => d.encryptionStatus === "ENABLED").length,
            status: "success",
          },
          {
            label: "Unencrypted",
            count: devices.filter(d => d.encryptionStatus === "DISABLED").length,
            status: "warning",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Device ID</th>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Patch Status</th>
                  <th className="text-left py-2 px-4">Encryption</th>
                  <th className="text-left py-2 px-4">Risk</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{device.deviceId}</td>
                    <td className="py-3 px-4">{device.name}</td>
                    <td className="py-3 px-4">{device.type}</td>
                    <td className="py-3 px-4">
                      <Badge variant={device.patchStatus === "CURRENT" ? "default" : "destructive"}>
                        {device.patchStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={device.encryptionStatus === "ENABLED" ? "default" : "outline"}>
                        {device.encryptionStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={device.riskLevel === "LOW" ? "secondary" : "destructive"}>
                        {device.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost" onClick={() => handleArchive(device.id)}>
                        Archive
                      </Button>
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
