import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"

async function main() {
  console.log("🌱 Seeding database...")

  // Create roles
  console.log("📋 Creating roles...")
  const adminRole = await prisma.role.upsert({
    where: { roleName: "admin" },
    update: {},
    create: {
      roleName: "admin",
      description: "Administrator with full system access",
    },
  })

  const teacherRole = await prisma.role.upsert({
    where: { roleName: "teacher" },
    update: {},
    create: {
      roleName: "teacher",
      description: "Teacher with classroom management access",
    },
  })

  const parentRole = await prisma.role.upsert({
    where: { roleName: "parent" },
    update: {},
    create: {
      roleName: "parent",
      description: "Parent with child data access",
    },
  })

  // Create permissions
  console.log("🔐 Creating permissions...")
  const permissions = [
    {
      key: "manage_users",
      label: "Manage Users",
      resource: "users",
      action: "manage",
    },
    {
      key: "assign_roles",
      label: "Assign Roles",
      resource: "roles",
      action: "assign",
    },
    {
      key: "view_admin_dashboard",
      label: "View Admin Dashboard",
      resource: "dashboard",
      action: "view",
    },
    {
      key: "view_teacher_dashboard",
      label: "View Teacher Dashboard",
      resource: "dashboard",
      action: "view",
    },
    {
      key: "view_parent_dashboard",
      label: "View Parent Dashboard",
      resource: "dashboard",
      action: "view",
    },
    {
      key: "manage_mfa",
      label: "Manage MFA",
      resource: "mfa",
      action: "manage",
    },
    {
      key: "view_audit_logs",
      label: "View Audit Logs",
      resource: "audit",
      action: "view",
    },
  ]

  const permissionRecords = await Promise.all(
    permissions.map((perm) =>
      prisma.permission.upsert({
        where: { permissionKey: perm.key },
        update: {},
        create: {
          permissionKey: perm.key,
          permissionLabel: perm.label,
          resource: perm.resource,
          action: perm.action,
        },
      })
    )
  )

  // Assign permissions to roles
  console.log("🔗 Assigning permissions to roles...")

  // Admin permissions
  const adminPermissions = permissionRecords.filter((p) =>
    [
      "manage_users",
      "assign_roles",
      "view_admin_dashboard",
      "manage_mfa",
      "view_audit_logs",
    ].includes(p.permissionKey)
  )

  for (const perm of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    })
  }

  // Teacher permissions
  const teacherPermissions = permissionRecords.filter((p) =>
    ["view_teacher_dashboard", "manage_mfa"].includes(p.permissionKey)
  )

  for (const perm of teacherPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: teacherRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: teacherRole.id,
        permissionId: perm.id,
      },
    })
  }

  // Parent permissions
  const parentPermissions = permissionRecords.filter((p) =>
    ["view_parent_dashboard", "manage_mfa"].includes(p.permissionKey)
  )

  for (const perm of parentPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: parentRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: parentRole.id,
        permissionId: perm.id,
      },
    })
  }

  // Create demo users
  console.log("👥 Creating demo users...")

  const demoUsers = [
    {
      email: "admin@springvale.edu",
      fullName: "Admin User",
      roleId: adminRole.id,
      password: "AdminPassword123!",
    },
    {
      email: "teacher@springvale.edu",
      fullName: "Teacher User",
      roleId: teacherRole.id,
      password: "TeacherPassword123!",
    },
    {
      email: "parent@springvale.edu",
      fullName: "Parent User",
      roleId: parentRole.id,
      password: "ParentPassword123!",
    },
  ]

  for (const user of demoUsers) {
    const passwordHash = await hashPassword(user.password)

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId,
        passwordHash,
        accountStatus: "ACTIVE",
      },
    })
  }

  console.log("✅ Database seeded successfully!")
  console.log("\n📝 Demo Accounts:")
  console.log("  - admin@springvale.edu (AdminPassword123!)")
  console.log("  - teacher@springvale.edu (TeacherPassword123!)")
  console.log("  - parent@springvale.edu (ParentPassword123!)")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
