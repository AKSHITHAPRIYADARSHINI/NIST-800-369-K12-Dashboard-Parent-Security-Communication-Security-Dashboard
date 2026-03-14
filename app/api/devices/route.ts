import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { logAuditEvent } from "@/lib/audit"
import { z } from "zod"

const CreateDeviceSchema = z.object({
  name: z.string(),
  type: z.enum(["LAPTOP", "DESKTOP", "TABLET", "CHROMEBOOK", "SERVER", "PRINTER", "OTHER"]),
  os: z.string(),
  assignedTo: z.string().optional(),
  department: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search")

  try {
    const where: any = { isArchived: false }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { deviceId: { contains: search, mode: "insensitive" } },
      ]
    }

    const devices = await prisma.device.findMany({
      where,
      include: { alerts: { where: { acknowledged: false } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: devices })
  } catch (error) {
    console.error("[GET /api/devices]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  if (user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })

  try {
    const body = await request.json()
    const data = CreateDeviceSchema.parse(body)

    const count = await prisma.device.count()
    const deviceId = `DEV-2026-${String(count + 1).padStart(4, "0")}`

    const device = await prisma.device.create({
      data: {
        ...data,
        deviceId,
        lastSeen: new Date(),
      },
      include: { alerts: true },
    })

    await logAuditEvent({
      userId: user.userId,
      action: "create_device",
      targetType: "Device",
      targetId: device.id,
      changes: { created: { id: device.id, deviceId: device.deviceId } },
    })

    return NextResponse.json({ success: true, data: device }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.issues }, { status: 400 })
    }
    console.error("[POST /api/devices]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
