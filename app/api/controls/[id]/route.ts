import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateControlSchema = z.object({
  status: z.enum(["DONE", "IN_PROCESS", "NOT_STARTED", "NOT_APPLICABLE"]).optional(),
  targetScore: z.number().optional(),
  currentScore: z.number().optional(),
  evidence: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateControlSchema.parse(body)

    const control = await prisma.controlMapping.findUnique({ where: { id } })
    if (!control) {
      return NextResponse.json({ success: false, error: "Control not found" }, { status: 404 })
    }

    const updated = await prisma.controlMapping.update({
      where: { id },
      data: {
        ...updates,
        reviewedBy: user.fullName,
        reviewedAt: new Date(),
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_control",
      targetType: "Control",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/controls/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
