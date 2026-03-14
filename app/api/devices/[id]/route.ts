import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateDeviceSchema = z.object({
  name: z.string().optional(),
  assignedTo: z.string().optional(),
  patchStatus: z.enum(["CURRENT", "PENDING", "OVERDUE", "CRITICAL"]).optional(),
  encryptionStatus: z.enum(["ENABLED", "DISABLED", "PARTIAL"]).optional(),
  antivirusStatus: z.enum(["ACTIVE", "INACTIVE", "OUTDATED"]).optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateDeviceSchema.parse(body)

    const device = await prisma.device.findUnique({ where: { id } })
    if (!device) return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })

    const updated = await prisma.device.update({
      where: { id },
      data: { ...updates, lastSeen: new Date() },
      include: { alerts: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_device",
      targetType: "Device",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/devices/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const device = await prisma.device.findUnique({ where: { id } })
    if (!device) return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 })

    const archived = await prisma.device.update({
      where: { id },
      data: { isArchived: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "archive_device",
      targetType: "Device",
      targetId: id,
      changes: { isArchived: true },
    })

    return NextResponse.json({ success: true, data: { id: archived.id, isArchived: archived.isArchived } })
  } catch (error) {
    console.error("[DELETE /api/devices/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
