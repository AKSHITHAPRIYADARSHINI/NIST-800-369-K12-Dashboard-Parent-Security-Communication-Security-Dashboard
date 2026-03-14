"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Users, Shield, Lock } from "lucide-react"
import { toast } from "sonner"
import { StatCard, StatusGrid } from "@/components/dashboard-ui"
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

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (!res.ok) throw new Error("Failed to fetch users")
      const json = await res.json()
      setUsers(json.data || [])
      setError(null)
    } catch (err) {
      setError(String(err))
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to deactivate user")
      toast.success("User deactivated")
      fetchUsers()
    } catch (err) {
      toast.error(String(err))
    }
  }

  // Calculate user statistics
  const activeUsers = users.filter(u => u.accountStatus === "ACTIVE").length
  const mfaEnabledUsers = users.filter(u => u.mfaEnabled).length
  const roleDistribution = users.reduce((acc: any, user: any) => {
    const role = user.role?.roleName || "Unassigned"
    const existing = acc.find((r: any) => r.name === role)
    if (existing) {
      existing.value++
    } else {
      acc.push({ name: role, value: 1 })
    }
    return acc
  }, [])

  const roleColors = {
    Administrator: "#dc2626",
    "Security Officer": "#f97316",
    Teacher: "#3b82f6",
    Staff: "#10b981",
    Unassigned: "#6b7280",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error: {error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage users, roles, and access control</p>
        </div>
        <Button onClick={() => toast.info("Add user form coming soon")}>Add User</Button>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          description="Active and inactive users"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          description={`${Math.round((activeUsers / users.length) * 100)}% of total`}
          icon={<Shield className="h-6 w-6" />}
          variant="success"
        />

        <StatCard
          title="MFA Enabled"
          value={mfaEnabledUsers}
          description={`${Math.round((mfaEnabledUsers / users.length) * 100)}% coverage`}
          icon={<Lock className="h-6 w-6" />}
          variant="success"
        />
      </div>

      {/* Role Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Users per role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistribution.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={roleColors[entry.name as keyof typeof roleColors] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <StatusGrid
          title="User Account Status"
          items={[
            {
              label: "Active",
              count: activeUsers,
              status: "success",
            },
            {
              label: "Inactive",
              count: users.filter(u => u.accountStatus === "INACTIVE").length,
              status: "neutral",
            },
            {
              label: "MFA Enabled",
              count: mfaEnabledUsers,
              status: "success",
            },
          ]}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total: {users.length} users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">MFA</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.fullName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge>{user.role?.roleName || "N/A"}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.accountStatus === "ACTIVE" ? "default" : "secondary"}>
                        {user.accountStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.mfaEnabled ? "default" : "outline"}>
                        {user.mfaEnabled ? "✓ On" : "Off"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeactivate(user.id)}
                        disabled={user.accountStatus === "INACTIVE"}
                      >
                        Deactivate
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
