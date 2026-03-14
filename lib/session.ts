import { prisma } from "@/lib/prisma"

export async function getSession(sessionToken: string) {
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!session) {
    return null
  }

  // Check if expired
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({
      where: { id: session.id },
    })
    return null
  }

  return session
}

export async function deleteSession(sessionToken: string): Promise<void> {
  await prisma.session.delete({
    where: { sessionToken },
  }).catch(() => {
    // Session might not exist, that's ok
  })
}

export async function validateSession(sessionToken: string) {
  const session = await getSession(sessionToken)
  return session ? { valid: true, session } : { valid: false, session: null }
}
