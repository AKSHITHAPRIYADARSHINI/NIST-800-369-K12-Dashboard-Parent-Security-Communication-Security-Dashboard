import { NextRequest } from "next/server"
import { validateSession } from "@/lib/session"

export type AuthUser = {
  userId: string
  email: string
  fullName: string
  role: string
  permissions: string[]
}

export async function requireAuth(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get("session")?.value
  if (!token) return null

  const { valid, session } = await validateSession(token)
  if (!valid || !session) return null

  return {
    userId: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    role: session.user.role.roleName,
    permissions: session.user.role.rolePermissions.map((rp) => rp.permission.permissionKey),
  }
}
