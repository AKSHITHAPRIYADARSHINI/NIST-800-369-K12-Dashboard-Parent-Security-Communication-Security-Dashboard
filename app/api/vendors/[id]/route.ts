import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateVendorSchema = z.object({
  name: z.string().optional(),
  service: z.string().optional(),
  dataSensitivity: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  riskRating: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  riskStatus: z.enum(["APPROVED", "UNDER_REVIEW", "AT_RISK", "REJECTED"]).optional(),
  contractStatus: z.enum(["ACTIVE", "EXPIRED", "PENDING", "TERMINATED"]).optional(),
  contractExpiry: z.string().optional(),
  dataAccess: z.string().optional(),
  notes: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateVendorSchema.parse(body)

    const vendor = await prisma.vendor.findUnique({ where: { id } })
    if (!vendor) return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 })

    const updated = await prisma.vendor.update({
      where: { id },
      data: {
        ...updates,
        contractExpiry: updates.contractExpiry ? new Date(updates.contractExpiry) : undefined,
        lastReview: new Date(),
      },
      include: { assessment: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_vendor",
      targetType: "Vendor",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/vendors/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
