import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const CreatePolicySchema = z.object({
  name: z.string(),
  category: z.enum([
    "AUTHENTICATION",
    "DATA_PROTECTION",
    "NETWORK",
    "DEVICE",
    "INCIDENT_RESPONSE",
    "VENDOR",
    "GOVERNANCE",
    "AWARENESS",
  ]),
  owner: z.string(),
  reviewCycle: z.number().optional(),
  summary: z.string().optional(),
  content: z.string().optional(),
  applicableTo: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const status = searchParams.get("status")

  try {
    const where: any = { isArchived: false }
    if (category) where.category = category
    if (status) where.status = status

    const policies = await prisma.securityPolicy.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: policies })
  } catch (error) {
    console.error("[GET /api/policies]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const data = CreatePolicySchema.parse(body)

    const policy = await prisma.securityPolicy.create({
      data: {
        ...data,
        status: "DRAFT",
        nextReview: new Date(Date.now() + (data.reviewCycle || 365) * 24 * 60 * 60 * 1000),
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "create_policy",
      targetType: "SecurityPolicy",
      targetId: policy.id,
      changes: { created: { id: policy.id, name: policy.name } },
    })

    return NextResponse.json({ success: true, data: policy }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/policies]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
