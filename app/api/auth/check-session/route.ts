import { NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No session" },
        { status: 401 }
      )
    }

    const sessionData = await validateSession(sessionToken)

    if (!sessionData.valid || !sessionData.session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        fullName: sessionData.session.user.fullName,
        role: sessionData.session.user.role.roleName,
      },
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Session check error:", errorMsg)

    return NextResponse.json(
      { error: "Session check failed" },
      { status: 500 }
    )
  }
}
