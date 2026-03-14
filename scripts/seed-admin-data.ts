import { prisma } from "@/lib/prisma"
import { NIST_INCIDENTS } from "@/lib/nist-mock-data"
import { VENDORS_FULL, ALL_DEVICES, INCIDENT_EVENTS, ACCESS_LOGS } from "@/lib/nist-extended-data"

async function main() {
  console.log("🌱 Seeding admin dashboard data...")

  try {
    // Clear existing data (optional - comment out to keep existing data)
    // console.log("🗑️  Clearing existing tables...")
    // await prisma.accessLog.deleteMany({})
    // await prisma.incidentEvent.deleteMany({})
    // await prisma.incident.deleteMany({})
    // await prisma.deviceAlert.deleteMany({})
    // await prisma.device.deleteMany({})
    // await prisma.vendorAssessment.deleteMany({})
    // await prisma.vendor.deleteMany({})
    // await prisma.controlMapping.deleteMany({})
    // await prisma.securityPolicy.deleteMany({})
    // await prisma.domainScore.deleteMany({})
    // await prisma.systemSetting.deleteMany({})

    // Seed ControlMapping from NIST_INCIDENTS
    console.log("📊 Seeding ControlMapping...")
    const controlMappings = NIST_INCIDENTS.slice(0, 68).map((incident, idx) => {
      const status = incident.status === "Done" ? "DONE" : "IN_PROCESS"
      const maturityLevel = incident.status === "Done" ? "LEVEL_3" : "LEVEL_2"
      return {
        controlId: `NIST-${String(idx + 1).padStart(4, "0")}`,
        title: incident.header,
        domain: extractDomain(incident.type),
        type: incident.type,
        status: status as "DONE" | "IN_PROCESS",
        targetScore: parseInt(incident.target) || 100,
        currentScore: parseInt(incident.limit) || 0,
        maturityLevel: maturityLevel as "LEVEL_3" | "LEVEL_2",
        evidence: `Control implemented and reviewed by ${incident.reviewer}`,
        notes: `Status: ${incident.status}`,
        reviewedBy: incident.reviewer,
        reviewedAt: incident.status === "Done" ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
      }
    })

    for (const control of controlMappings) {
      await prisma.controlMapping.upsert({
        where: { controlId: control.controlId },
        update: control,
        create: control,
      })
    }
    console.log(`✅ Created/updated ${controlMappings.length} control mappings`)

    // Seed Devices
    console.log("🖥️  Seeding Devices...")
    const devices = ALL_DEVICES.slice(0, 15).map((dev: any, idx) => {
      const deviceData: any = {
        deviceId: dev.deviceId || `DEV-2026-${String(idx + 1).padStart(4, "0")}`,
        name: dev.deviceName || dev.name || `Device-${idx + 1}`,
        type: mapDeviceType(dev.type || dev.os || "LAPTOP"),
        os: dev.os || "Unknown",
        assignedTo: dev.assignedTo || null,
        department: extractDepartment(dev.department || "IT"),
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        patchStatus: mapPatchStatus(dev.patchStatus || "CURRENT"),
        encryptionStatus: (dev.encrypted ? "ENABLED" : "DISABLED") as "ENABLED" | "DISABLED" | "PARTIAL",
        antivirusStatus: (dev.antivirusActive ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE" | "OUTDATED",
        riskScore: dev.riskScore || 0,
        riskLevel: mapRiskLevel(dev.riskLevel || "LOW"),
      }
      return deviceData
    })

    for (const device of devices) {
      await prisma.device.upsert({
        where: { deviceId: device.deviceId },
        update: device,
        create: device,
      })
    }
    console.log(`✅ Created/updated ${devices.length} devices`)

    // Seed Vendors
    console.log("🤝 Seeding Vendors...")
    const vendors = VENDORS_FULL.slice(0, 12).map((vendor: any) => ({
      name: vendor.name,
      service: vendor.service,
      dataSensitivity: mapDataSensitivity(vendor.dataSensitivity || "Low"),
      riskRating: mapRiskRating(vendor.riskRating || "Low"),
      riskStatus: mapVendorRiskStatus(vendor.riskStatus || "Under Review"),
      contractStatus: mapContractStatus(vendor.contractStatus || "Active"),
      contractExpiry: vendor.contractExpiry ? new Date(vendor.contractExpiry) : null,
      lastReview: vendor.lastReview ? new Date(vendor.lastReview) : new Date(),
      dataAccess: vendor.dataAccess || "",
      notes: vendor.notes || "",
    }))

    const createdVendors = []
    for (const vendor of vendors) {
      const created = await prisma.vendor.create({
        data: vendor,
      }).catch(() => {
        // Vendor might already exist, skip
        return null
      })
      if (created) createdVendors.push(created)
    }
    console.log(`✅ Created ${createdVendors.length} vendors`)

    // Seed VendorAssessments
    console.log("📋 Seeding VendorAssessments...")
    for (let i = 0; i < createdVendors.length; i++) {
      const vendor = createdVendors[i]
      const assessment: any = {
        vendorId: vendor.id,
        assessmentDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        assessor: ["Security Team", "Compliance Officer", "IT Manager"][i % 3],
        ferpaCompliant: Math.random() > 0.3,
        coppaCompliant: Math.random() > 0.2,
        soc2Certified: Math.random() > 0.4,
        penetrationTested: Math.random() > 0.6,
        dataEncryption: Math.random() > 0.2,
        dataResidency: "USA",
        breachHistory: Math.random() > 0.8,
        overallScore: 60 + Math.random() * 40,
        recommendation: (Math.random() > 0.3 ? "APPROVE" : "REASSESS") as "APPROVE" | "REJECT" | "REASSESS" | "CONDITIONAL",
        nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        findings: `Assessment completed. No critical issues found.`,
      }

      await prisma.vendorAssessment.upsert({
        where: { vendorId: vendor.id },
        update: assessment,
        create: assessment,
      })
    }
    console.log(`✅ Created/updated ${createdVendors.length} vendor assessments`)

    // Seed Incidents
    console.log("🚨 Seeding Incidents...")
    const incidents = INCIDENT_EVENTS.slice(0, 20).map((event: any, idx) => {
      const incidentData: any = {
        title: event.title || `Incident ${idx + 1}`,
        type: event.type || "Security",
        severity: mapIncidentSeverity(event.severity || "Medium"),
        status: (event.status === "Resolved" ? "RESOLVED" : "OPEN") as "OPEN" | "INVESTIGATING" | "CONTAINED" | "REMEDIATING" | "RESOLVED" | "CLOSED",
        assignee: ["Alice Johnson", "Bob Smith", "Carol Davis"][idx % 3],
        reportedAt: event.date ? new Date(event.date) : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        affectedSystems: event.affectedSystems || extractAffectedSystems(event.type || ""),
        affectedUsers: Math.floor(Math.random() * 50),
        nextAction: event.status === "Resolved" ? "Monitor" : "Investigate",
        resolvedAt: event.status === "Resolved" ? new Date() : null,
        mttr: event.mttr || undefined,
      }
      return incidentData
    })

    const createdIncidents = []
    for (const incident of incidents) {
      const created = await prisma.incident.create({
        data: incident,
      })
      createdIncidents.push(created)

      // Create initial event
      await prisma.incidentEvent.create({
        data: {
          incidentId: created.id,
          timestamp: created.reportedAt,
          actor: "System",
          action: "Incident reported",
          notes: `${created.title} reported with severity ${created.severity}`,
        },
      })
    }
    console.log(`✅ Created ${createdIncidents.length} incidents with timeline events`)

    // Seed SecurityPolicies
    console.log("📜 Seeding SecurityPolicies...")
    const policies = [
      {
        name: "Acceptable Use Policy",
        category: "GOVERNANCE",
        owner: "Compliance Officer",
        summary: "Guidelines for appropriate use of school IT resources",
      },
      {
        name: "Data Protection Policy",
        category: "DATA_PROTECTION",
        owner: "Data Privacy Officer",
        summary: "Protection and handling of sensitive student data",
      },
      {
        name: "Authentication Policy",
        category: "AUTHENTICATION",
        owner: "Security Manager",
        summary: "Requirements for user authentication and MFA",
      },
      {
        name: "Network Security Policy",
        category: "NETWORK",
        owner: "Network Administrator",
        summary: "Network access controls and segmentation requirements",
      },
      {
        name: "Device Management Policy",
        category: "DEVICE",
        owner: "IT Director",
        summary: "Device provisioning, patching, and lifecycle management",
      },
      {
        name: "Incident Response Policy",
        category: "INCIDENT_RESPONSE",
        owner: "Security Team",
        summary: "Procedures for detecting and responding to security incidents",
      },
      {
        name: "Vendor Management Policy",
        category: "VENDOR",
        owner: "Procurement",
        summary: "Assessment and oversight of third-party vendors",
      },
      {
        name: "Security Awareness Policy",
        category: "AWARENESS",
        owner: "HR/Security",
        summary: "Training and awareness program requirements",
      },
      {
        name: "Access Control Policy",
        category: "AUTHENTICATION",
        owner: "Security Manager",
        summary: "Principles and procedures for granting system access",
      },
      {
        name: "Backup and Disaster Recovery",
        category: "GOVERNANCE",
        owner: "IT Operations",
        summary: "Data backup and business continuity procedures",
      },
      {
        name: "Mobile Device Policy",
        category: "DEVICE",
        owner: "IT Director",
        summary: "Security requirements for mobile and BYOD devices",
      },
      {
        name: "Password Policy",
        category: "AUTHENTICATION",
        owner: "Security Manager",
        summary: "Password strength and management requirements",
      },
    ]

    for (const policy of policies) {
      const policyData: any = {
        ...policy,
        category: policy.category as "AUTHENTICATION" | "DATA_PROTECTION" | "NETWORK" | "DEVICE" | "INCIDENT_RESPONSE" | "VENDOR" | "GOVERNANCE" | "AWARENESS",
        status: "ACTIVE",
        owner: policy.owner,
        nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
      await prisma.securityPolicy.create({
        data: policyData,
      }).catch(() => {
        // Policy might already exist, skip
      })
    }
    console.log(`✅ Created ${policies.length} security policies`)

    // Seed DomainScores
    console.log("📈 Seeding DomainScores...")
    const domainScores = [
      { domain: "Authentication", score: 87, trend: 2 },
      { domain: "Device Security", score: 82, trend: 1 },
      { domain: "Data Protection", score: 91, trend: 2 },
      { domain: "Vendor Risk", score: 78, trend: -1 },
      { domain: "Incident Response", score: 85, trend: 1 },
    ]

    for (const ds of domainScores) {
      await prisma.domainScore.upsert({
        where: { domain: ds.domain },
        update: { score: ds.score, trend: ds.trend, lastCalculatedAt: new Date() },
        create: { ...ds, lastCalculatedAt: new Date() },
      })
    }
    console.log(`✅ Created/updated ${domainScores.length} domain scores`)

    // Seed AccessLogs
    console.log("📝 Seeding AccessLogs...")
    const accessLogs = ACCESS_LOGS.slice(0, 50).map((log: any, idx) => ({
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      userId: log.userId || null,
      userEmail: log.userEmail || `user${idx}@example.com`,
      userRole: log.userRole || "teacher",
      action: log.action || "login",
      resource: log.resource || "dashboard",
      ipAddress: log.ipAddress || "192.168.1.1",
      location: log.location || "School Building",
      result: log.result ? mapAccessLogResult(log.result) : "SUCCESS",
      riskFlag: log.riskFlag || Math.random() > 0.95,
    }))

    for (const log of accessLogs) {
      await prisma.accessLog.create({
        data: log,
      })
    }
    console.log(`✅ Created ${accessLogs.length} access logs`)

    // Seed SystemSettings
    console.log("⚙️  Seeding SystemSettings...")
    const settings = [
      { key: "session_timeout", value: "30", label: "Session Timeout (minutes)", category: "Security" },
      { key: "mfa_required", value: "admin", label: "MFA Required For", category: "Security" },
      { key: "audit_retention_days", value: "365", label: "Audit Log Retention (days)", category: "Compliance" },
      { key: "password_expiry_days", value: "90", label: "Password Expiry (days)", category: "Security" },
      { key: "min_password_length", value: "12", label: "Minimum Password Length", category: "Security" },
      { key: "account_lockout_attempts", value: "5", label: "Account Lockout After Attempts", category: "Security" },
      { key: "account_lockout_minutes", value: "15", label: "Account Lockout Duration (minutes)", category: "Security" },
      { key: "app_version", value: "1.0.0", label: "Application Version", category: "System" },
    ]

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, label: setting.label, category: setting.category },
        create: { ...setting, updatedAt: new Date() },
      })
    }
    console.log(`✅ Created/updated ${settings.length} system settings`)

    console.log("✨ Admin data seeding complete!")
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Helper functions
function extractDomain(type: string): string {
  const mapping: Record<string, string> = {
    Technical: "Technical Controls",
    Administrative: "Administrative Controls",
    Physical: "Physical Security",
    Legal: "Legal Compliance",
    Planning: "Strategic Planning",
  }
  return mapping[type] || type
}

function mapDeviceType(type: string): "LAPTOP" | "DESKTOP" | "TABLET" | "CHROMEBOOK" | "SERVER" | "PRINTER" | "OTHER" {
  const lower = type.toLowerCase()
  if (lower.includes("laptop")) return "LAPTOP"
  if (lower.includes("desktop")) return "DESKTOP"
  if (lower.includes("tablet") || lower.includes("ipad")) return "TABLET"
  if (lower.includes("chromebook")) return "CHROMEBOOK"
  if (lower.includes("server") || lower.includes("ubuntu")) return "SERVER"
  if (lower.includes("printer")) return "PRINTER"
  return "OTHER"
}

function mapPatchStatus(status: string): "CURRENT" | "PENDING" | "OVERDUE" | "CRITICAL" {
  const lower = status.toLowerCase()
  if (lower.includes("current") || lower.includes("up to date")) return "CURRENT"
  if (lower.includes("pending")) return "PENDING"
  if (lower.includes("critical")) return "CRITICAL"
  if (lower.includes("overdue")) return "OVERDUE"
  return "CURRENT"
}

function mapRiskLevel(level: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const lower = level.toLowerCase()
  if (lower.includes("critical")) return "CRITICAL"
  if (lower.includes("high")) return "HIGH"
  if (lower.includes("medium")) return "MEDIUM"
  return "LOW"
}

function extractDepartment(dept: string): string {
  return dept || "General"
}

function mapDataSensitivity(sens: string): "LOW" | "MEDIUM" | "HIGH" {
  const lower = sens.toLowerCase()
  if (lower.includes("high")) return "HIGH"
  if (lower.includes("medium")) return "MEDIUM"
  return "LOW"
}

function mapRiskRating(rating: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const lower = rating.toLowerCase()
  if (lower.includes("critical")) return "CRITICAL"
  if (lower.includes("high")) return "HIGH"
  if (lower.includes("medium")) return "MEDIUM"
  return "LOW"
}

function mapVendorRiskStatus(status: string): "APPROVED" | "UNDER_REVIEW" | "AT_RISK" | "REJECTED" {
  const lower = status.toLowerCase()
  if (lower.includes("approved")) return "APPROVED"
  if (lower.includes("rejected")) return "REJECTED"
  if (lower.includes("at risk")) return "AT_RISK"
  return "UNDER_REVIEW"
}

function mapContractStatus(status: string): "ACTIVE" | "EXPIRED" | "PENDING" | "TERMINATED" {
  const lower = status.toLowerCase()
  if (lower.includes("active")) return "ACTIVE"
  if (lower.includes("expired")) return "EXPIRED"
  if (lower.includes("terminated")) return "TERMINATED"
  return "PENDING"
}

function mapIncidentSeverity(severity: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const lower = severity.toLowerCase()
  if (lower.includes("critical")) return "CRITICAL"
  if (lower.includes("high")) return "HIGH"
  if (lower.includes("medium")) return "MEDIUM"
  return "LOW"
}

function mapAccessLogResult(result: string): "SUCCESS" | "FAILURE" | "BLOCKED" {
  const lower = result.toLowerCase()
  if (lower.includes("failure") || lower.includes("failed")) return "FAILURE"
  if (lower.includes("blocked")) return "BLOCKED"
  return "SUCCESS"
}

function extractAffectedSystems(type: string): string {
  const systemMap: Record<string, string> = {
    "Email Security": "Email servers, mail clients",
    "Data Access": "Database, file shares",
    Network: "Network infrastructure, VPN",
    Infrastructure: "Web servers, certificates",
    Authentication: "Directory services, SSO",
    Malware: "Endpoints, email gateway",
    "Access Control": "Identity management system",
    DLP: "Data classification system",
    Vulnerability: "Application servers",
  }
  return systemMap[type] || "Multiple systems"
}

main()
