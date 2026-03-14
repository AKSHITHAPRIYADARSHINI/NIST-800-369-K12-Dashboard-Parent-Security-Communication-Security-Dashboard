import { prisma } from "@/lib/prisma"
import type { InputJsonValue } from "@prisma/client/runtime/library"

export async function logAuditEvent(params: {
  userId: string | null
  action: string
  targetType?: string
  targetId?: string
  changes?: Record<string, unknown>
  ipAddress?: string
}): Promise<void> {
  await prisma.auditLog
    .create({
      data: {
        userId: params.userId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        changes: params.changes as InputJsonValue,
        ipAddress: params.ipAddress,
        timestamp: new Date(),
      },
    })
    .catch(() => {
      // Silently fail if audit logging fails
    })
}
