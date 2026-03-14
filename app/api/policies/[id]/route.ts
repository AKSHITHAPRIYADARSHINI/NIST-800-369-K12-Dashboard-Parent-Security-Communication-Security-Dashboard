import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdatePolicySchema = z.object({
  name: z.string().optional(),
  status: z.enum(["ACTIVE", "UNDER_REVIEW", "ARCHIVED", "DRAFT"]).optional(),
  owner: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  reviewCycle: z.number().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdatePolicySchema.parse(body)

    const policy = await prisma.securityPolicy.findUnique({ where: { id } })
    if (!policy) return NextResponse.json({ success: false, error: "Policy not found" }, { status: 404 })

    const updated = await prisma.securityPolicy.update({
      where: { id },
      data: {
        ...updates,
        lastUpdated: new Date(),
        nextReview: updates.reviewCycle ? new Date(Date.now() + updates.reviewCycle * 24 * 60 * 60 * 1000) : policy.nextReview,
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_policy",
      targetType: "SecurityPolicy",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/policies/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const policy = await prisma.securityPolicy.findUnique({ where: { id } })
    if (!policy) return NextResponse.json({ success: false, error: "Policy not found" }, { status: 404 })

    const archived = await prisma.securityPolicy.update({
      where: { id },
      data: { isArchived: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "archive_policy",
      targetType: "SecurityPolicy",
      targetId: id,
      changes: { isArchived: true },
    })

    return NextResponse.json({ success: true, data: { id: archived.id, isArchived: archived.isArchived } })
  } catch (error) {
    console.error("[DELETE /api/policies/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
