import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { z } from "zod"

const CreateEventSchema = z.object({
  action: z.string(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const { action, notes } = CreateEventSchema.parse(body)

    const incident = await prisma.incident.findUnique({ where: { id } })
    if (!incident) return NextResponse.json({ success: false, error: "Incident not found" }, { status: 404 })

    const event = await prisma.incidentEvent.create({
      data: {
        incidentId: id,
        timestamp: new Date(),
        actor: user.fullName,
        action,
        notes,
      },
    })

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/incidents/:id/events]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
