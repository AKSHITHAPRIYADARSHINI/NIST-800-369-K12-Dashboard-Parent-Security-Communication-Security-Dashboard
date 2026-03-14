import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const user = await requireAuth(request)
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

  try {
    // Get compliance scores
    const [controls, devices, incidents, users, policies, accessLogs, domainScores] = await Promise.all([
      prisma.controlMapping.findMany(),
      prisma.device.findMany({ where: { isArchived: false } }),
      prisma.incident.findMany(),
      prisma.user.findMany(),
      prisma.securityPolicy.findMany({ where: { isArchived: false } }),
      prisma.accessLog.findMany({ where: { riskFlag: true } }),
      prisma.domainScore.findMany(),
    ])

    // Calculate metrics
    const controlMetrics = {
      total: controls.length,
      done: controls.filter((c) => c.status === "DONE").length,
      inProcess: controls.filter((c) => c.status === "IN_PROCESS").length,
      notStarted: controls.filter((c) => c.status === "NOT_STARTED").length,
    }

    const deviceMetrics = {
      total: devices.length,
      compliant: devices.filter((d) => d.patchStatus === "CURRENT" && d.encryptionStatus === "ENABLED").length,
      atRisk: devices.filter((d) => d.riskLevel === "HIGH" || d.riskLevel === "CRITICAL").length,
    }

    const incidentMetrics = {
      total: incidents.length,
      open: incidents.filter((i) => i.status === "OPEN").length,
      critical: incidents.filter((i) => i.severity === "CRITICAL").length,
      resolved: incidents.filter((i) => i.status === "RESOLVED" || i.status === "CLOSED").length,
    }

    const userMetrics = {
      total: users.length,
      mfaEnabled: users.filter((u) => u.mfaEnabled).length,
      mfaPercentage: users.length > 0 ? Math.round((users.filter((u) => u.mfaEnabled).length / users.length) * 100) : 0,
    }

    const complianceScore = domainScores.length > 0 ? Math.round(domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length) : 0

    const topRisks = devices
      .filter((d) => d.riskLevel === "CRITICAL" || d.riskLevel === "HIGH")
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((d) => ({ id: d.id, name: d.name, riskLevel: d.riskLevel }))

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          complianceScore,
          deviceCompliance: deviceMetrics.total > 0 ? Math.round((deviceMetrics.compliant / deviceMetrics.total) * 100) : 0,
          mfaAdoption: userMetrics.mfaPercentage,
          incidentResolutionRate: incidentMetrics.total > 0 ? Math.round((incidentMetrics.resolved / incidentMetrics.total) * 100) : 0,
        },
        summary: {
          controls: controlMetrics,
          devices: deviceMetrics,
          incidents: incidentMetrics,
          users: userMetrics,
          policies: { total: policies.length },
          accessAnomalies: accessLogs.length,
        },
        topRisks,
        domainScores: domainScores.map((ds) => ({ domain: ds.domain, score: ds.score, trend: ds.trend })),
        lastUpdated: new Date(),
      },
    })
  } catch (error) {
    console.error("[GET /api/dashboard/overview]", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
