import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const sessionToken = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + (30 * 60 * 1000)) // 30 minutes

  await prisma.session.create({
    data: {
      userId,
      sessionToken,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })

  return sessionToken
}
