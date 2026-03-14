import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const UpdateSettingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
})

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    const settings = await prisma.systemSetting.findMany({
      orderBy: { category: "asc" },
    })

    return NextResponse.json({
      success: true,
      data: settings.map((s) => ({
        id: s.id,
        key: s.key,
        value: s.value,
        label: s.label,
        category: s.category,
      })),
    })
  } catch (error) {
    console.error("[GET /api/settings]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const { settings } = UpdateSettingsSchema.parse(body)

    const updates = settings.map((s) =>
      prisma.systemSetting.update({
        where: { key: s.key },
        data: { value: s.value, updatedBy: user.fullName, updatedAt: new Date() },
      })
    )

    await prisma.$transaction(updates)

    await logAuditEvent({
      userId: user.userId,
      action: "update_settings",
      targetType: "SystemSetting",
      changes: { updated: settings.map((s) => s.key) },
    })

    const updated = await prisma.systemSetting.findMany()

    return NextResponse.json({
      success: true,
      data: updated.map((s) => ({
        id: s.id,
        key: s.key,
        value: s.value,
        label: s.label,
        category: s.category,
      })),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[PUT /api/settings]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
