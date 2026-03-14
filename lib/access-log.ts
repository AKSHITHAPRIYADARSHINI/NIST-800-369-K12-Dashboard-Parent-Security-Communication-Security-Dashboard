import { prisma } from "@/lib/prisma"

export async function logAccess(params: {
  userId?: string
  userEmail: string
  userRole: string
  action: string
  resource: string
  ipAddress?: string
  location?: string
  result: "SUCCESS" | "FAILURE" | "BLOCKED"
  riskFlag?: boolean
}): Promise<void> {
  await prisma.accessLog
    .create({
      data: {
        ...params,
        timestamp: new Date(),
      },
    })
    .catch(() => {
      // Silently fail if access logging fails
    })
}
