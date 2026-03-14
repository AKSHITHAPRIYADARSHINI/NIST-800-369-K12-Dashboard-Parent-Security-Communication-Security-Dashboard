import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { z } from "zod"

const UpdateAlertSchema = z.object({
  acknowledged: z.boolean().optional(),
  resolvedAt: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const updates = UpdateAlertSchema.parse(body)

    const alert = await prisma.deviceAlert.findUnique({ where: { id } })
    if (!alert) return NextResponse.json({ success: false, error: "Alert not found" }, { status: 404 })

    const updated = await prisma.deviceAlert.update({
      where: { id },
      data: {
        ...updates,
        resolvedAt: updates.resolvedAt ? new Date(updates.resolvedAt) : undefined,
      },
      include: { device: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/devices/alerts/:id]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
