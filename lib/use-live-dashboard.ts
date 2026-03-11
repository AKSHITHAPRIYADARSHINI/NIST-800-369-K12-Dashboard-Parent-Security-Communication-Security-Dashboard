"use client"

import { useEffect, useState } from "react"
import {
  BASE_METRICS,
  NIST_INCIDENTS,
  TREND_DATA,
  type ChartDataPoint,
  type SecurityIncident,
  type SecurityMetrics,
  type UserRole,
  filterIncidentsByRole,
} from "./nist-mock-data"

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function randDelta(): number {
  return Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : -Math.floor(Math.random() * 2) - 1
}

export function useLiveDashboard(role: UserRole) {
  const [metrics, setMetrics] = useState<SecurityMetrics>(BASE_METRICS)
  const [chartData, setChartData] = useState<ChartDataPoint[]>(TREND_DATA)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Live updates simulation: every 10s, randomly adjust metrics ±1-2
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        compliance: clamp(prev.compliance + randDelta(), 60, 100),
        protection: clamp(prev.protection + randDelta(), 60, 100),
        authentication: clamp(prev.authentication + randDelta(), 60, 100),
        incidentResponse: clamp(prev.incidentResponse + randDelta(), 60, 100),
      }))
      setLastUpdated(new Date())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Filter incidents by role
  const incidents = filterIncidentsByRole(NIST_INCIDENTS, role)

  // Adjust metrics visibility based on role
  const visibleMetrics = role === "parent"
    ? {
        compliance: metrics.compliance,
        protection: metrics.protection,
        authentication: 0, // Hidden for parent
        incidentResponse: 0, // Hidden for parent
      }
    : role === "teacher"
    ? metrics
    : metrics

  // Simplify chart for parent (show only protection and compliance)
  const visibleChartData = role === "parent"
    ? chartData.map(d => ({
        ...d,
        Security: d.Protection, // Replace Security with Protection
      }))
    : chartData

  return { metrics: visibleMetrics, chartData: visibleChartData, incidents, lastUpdated }
}
