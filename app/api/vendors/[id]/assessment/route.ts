import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateAssessmentSchema = z.object({
  assessmentDate: z.string().optional(),
  assessor: z.string().optional(),
  ferpaCompliant: z.boolean().optional(),
  coppaCompliant: z.boolean().optional(),
  soc2Certified: z.boolean().optional(),
  penetrationTested: z.boolean().optional(),
  dataEncryption: z.boolean().optional(),
  dataResidency: z.string().optional(),
  breachHistory: z.boolean().optional(),
  recommendation: z.enum(["APPROVE", "REJECT", "REASSESS", "CONDITIONAL"]).optional(),
  nextReview: z.string().optional(),
  findings: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const assessment = await prisma.vendorAssessment.findUnique({
      where: { vendorId: id },
      include: { vendor: true },
    })

    if (!assessment) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: assessment })
  } catch (error) {
    console.error("[GET /api/vendors/:id/assessment]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateAssessmentSchema.parse(body)

    let assessment = await prisma.vendorAssessment.findUnique({ where: { vendorId: id } })

    if (!assessment) {
      assessment = await prisma.vendorAssessment.create({
        data: {
          vendorId: id,
          assessmentDate: new Date(),
          assessor: user.fullName,
          ...updates,
          nextReview: updates.nextReview ? new Date(updates.nextReview) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        },
        include: { vendor: true },
      })
    } else {
      const overallScore = [
        updates.ferpaCompliant,
        updates.coppaCompliant,
        updates.soc2Certified,
        updates.penetrationTested,
        updates.dataEncryption,
      ].filter(Boolean).length * 20

      assessment = await prisma.vendorAssessment.update({
        where: { vendorId: id },
        data: {
          ...updates,
          overallScore: overallScore || assessment.overallScore,
          assessmentDate: updates.assessmentDate ? new Date(updates.assessmentDate) : assessment.assessmentDate,
          nextReview: updates.nextReview ? new Date(updates.nextReview) : assessment.nextReview,
        },
        include: { vendor: true },
      })
    }

    await logAuditEvent({
      userId: user.userId,
      action: "update_vendor_assessment",
      targetType: "VendorAssessment",
      targetId: assessment.id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: assessment })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/vendors/:id/assessment]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
