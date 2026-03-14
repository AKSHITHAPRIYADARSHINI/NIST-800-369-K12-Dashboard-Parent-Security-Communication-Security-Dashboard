import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateIncidentSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "CONTAINED", "REMEDIATING", "RESOLVED", "CLOSED"]).optional(),
  assignee: z.string().optional(),
  nextAction: z.string().optional(),
  affectedUsers: z.number().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: { events: { orderBy: { timestamp: "desc" } } },
    })

    if (!incident) return NextResponse.json({ success: false, error: "Incident not found" }, { status: 404 })

    return NextResponse.json({ success: true, data: incident })
  } catch (error) {
    console.error("[GET /api/incidents/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateIncidentSchema.parse(body)

    const incident = await prisma.incident.findUnique({ where: { id } })
    if (!incident) return NextResponse.json({ success: false, error: "Incident not found" }, { status: 404 })

    let updateData: any = { ...updates, updatedAt: new Date() }

    // If resolving, calculate MTTR
    if (updates.status === "RESOLVED" && incident.status !== "RESOLVED") {
      const reportedTime = incident.reportedAt.getTime()
      const resolvedTime = new Date().getTime()
      const diffMs = resolvedTime - reportedTime
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      updateData.mttr = `${hours}h ${minutes}m`
      updateData.resolvedAt = new Date()
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: updateData,
      include: { events: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "update_incident",
      targetType: "Incident",
      targetId: id,
      changes: updates,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/incidents/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
