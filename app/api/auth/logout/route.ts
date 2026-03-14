import { NextRequest, NextResponse } from "next/server"
import { deleteSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    const response = NextResponse.json({ success: true })

    response.cookies.delete("session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}
