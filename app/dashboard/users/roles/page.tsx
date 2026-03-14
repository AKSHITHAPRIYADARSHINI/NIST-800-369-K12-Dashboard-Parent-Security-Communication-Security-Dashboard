"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function RolesPage() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then(r => r.json()),
      fetch("/api/roles").then(r => r.json()),
    ])
      .then(([usersRes, rolesRes]) => {
        setUsers(usersRes.data || [])
        setRoles(rolesRes.data || [])
      })
      .catch(err => toast.error("Failed to load data"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
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
      <h1 className="text-3xl font-bold">User Roles & Permissions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="border-b pb-4 last:border-b-0">
                <h3 className="font-bold text-lg">{role.roleName}</h3>
                <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions?.map((perm: any) => (
                    <Badge key={perm.id} variant="outline">
                      {perm.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent>
          {roles.map((role) => {
            const usersInRole = users.filter(u => u.role?.id === role.id)
            return (
              <div key={role.id} className="mb-4 pb-4 border-b last:border-b-0">
                <h3 className="font-bold mb-2">{role.roleName} ({usersInRole.length})</h3>
                <div className="space-y-1">
                  {usersInRole.map((user) => (
                    <div key={user.id} className="text-sm flex justify-between">
                      <span>{user.fullName}</span>
                      <span className="text-gray-500">{user.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
