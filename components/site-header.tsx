"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRole } from "@/lib/nist-mock-data"

interface SiteHeaderProps {
  role?: UserRole
  onRoleChange?: (role: UserRole) => void
}

const ROLE_LABELS: Record<UserRole, string> = {
  parent: "Parent View",
  teacher: "Teacher View",
  admin: "Admin View",
}

export function SiteHeader({ role = "admin", onRoleChange }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background px-4 py-3 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-lg font-semibold">NIST 800-369 Security Dashboard</h1>
        <span className="text-xs text-muted-foreground">K-12 Cybersecurity Framework</span>
      </div>
      {onRoleChange && (
        <Select value={role} onValueChange={(value) => value && onRoleChange(value as UserRole)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectGroup>
              <SelectItem value="parent">{ROLE_LABELS.parent}</SelectItem>
              <SelectItem value="teacher">{ROLE_LABELS.teacher}</SelectItem>
              <SelectItem value="admin">{ROLE_LABELS.admin}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </header>
  )
}
