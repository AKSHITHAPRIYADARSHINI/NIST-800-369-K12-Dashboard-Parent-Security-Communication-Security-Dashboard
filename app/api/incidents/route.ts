import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const CreateIncidentSchema = z.object({
  title: z.string(),
  type: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  assignee: z.string().optional(),
  affectedSystems: z.string().optional(),
  affectedUsers: z.number().optional(),
})

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const severity = searchParams.get("severity")

  try {
    const where: any = {}
    if (status) where.status = status
    if (severity) where.severity = severity

    const incidents = await prisma.incident.findMany({
      where,
      include: { events: { orderBy: { timestamp: "desc" } } },
      orderBy: { reportedAt: "desc" },
    })

    return NextResponse.json({ success: true, data: incidents })
  } catch (error) {
    console.error("[GET /api/incidents]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const data = CreateIncidentSchema.parse(body)

    const incident = await prisma.incident.create({
      data: {
        ...data,
        status: "OPEN",
        reportedAt: new Date(),
      },
    })

    // Create initial event
    await prisma.incidentEvent.create({
      data: {
        incidentId: incident.id,
        timestamp: new Date(),
        actor: user.fullName,
        action: "Incident reported",
        notes: `${data.title} - Severity: ${data.severity}`,
      },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "create_incident",
      targetType: "Incident",
      targetId: incident.id,
      changes: { created: { id: incident.id, title: data.title } },
    })

    const fullIncident = await prisma.incident.findUnique({
      where: { id: incident.id },
      include: { events: true },
    })

    return NextResponse.json({ success: true, data: fullIncident }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/incidents]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
