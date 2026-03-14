"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function MFAPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(json => setUsers(json.data || []))
      .catch(err => toast.error("Failed to load users"))
      .finally(() => setLoading(false))
  }, [])

  const handleEnableMFA = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/mfa-policy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mfaEnabled: true }),
      })
      if (!res.ok) throw new Error("Failed to enable MFA")
      toast.success("MFA enabled for user")
      setUsers(users.map(u => u.id === userId ? { ...u, mfaEnabled: true } : u))
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

  const mfaEnabled = users.filter(u => u.mfaEnabled).length
  const mfaPercentage = users.length > 0 ? Math.round((mfaEnabled / users.length) * 100) : 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Multi-Factor Authentication (MFA)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MFA Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{mfaEnabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Adoption %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mfaPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>MFA Status by User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">MFA Status</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.fullName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role?.roleName}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.mfaEnabled ? "default" : "destructive"}>
                        {user.mfaEnabled ? "✓ Enabled" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {!user.mfaEnabled && (
                        <Button
                          size="sm"
                          onClick={() => handleEnableMFA(user.id)}
                        >
                          Enable
                        </Button>
                      )}
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
