"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export type AuthUser = {
  id: string
  email: string
  fullName: string
  roleName: string
  accountStatus: string
}

export function useAuthGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/check-session")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => router.push(`/auth/login?redirect=${pathname}`))
      .finally(() => setIsLoading(false))
  }, [])

  return { user, isLoading }
}
