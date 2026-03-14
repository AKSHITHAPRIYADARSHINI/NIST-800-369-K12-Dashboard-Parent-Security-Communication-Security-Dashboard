"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(json => setSettings(json.data || []))
      .catch(err => toast.error("Failed to load settings"))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      const updatedSettings = settings.map(s => ({
        key: s.key,
        value: editing[s.key] !== undefined ? editing[s.key] : s.value,
      }))

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updatedSettings }),
      })

      if (!res.ok) throw new Error("Failed to save settings")
      toast.success("Settings saved")
      setEditing({})
      const json = await res.json()
      setSettings(json.data || [])
    } catch (err) {
      toast.error(String(err))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 mb-2" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-10 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const groups = settings.reduce((acc: any, s: any) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Settings</h1>

      {Object.entries(groups).map(([category, items]: [string, any]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((setting: any) => (
              <div key={setting.key} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-xs text-gray-500">{setting.key}</p>
                </div>
                <Input
                  type="text"
                  value={editing[setting.key] !== undefined ? editing[setting.key] : setting.value}
                  onChange={(e) => setEditing(prev => ({ ...prev, [setting.key]: e.target.value }))}
                  className="w-48"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSave} className="w-full">
        Save Changes
      </Button>
    </div>
  )
}
