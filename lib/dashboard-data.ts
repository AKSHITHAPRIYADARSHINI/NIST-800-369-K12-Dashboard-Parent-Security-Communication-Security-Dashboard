// Reusable sample data for dashboard visualizations

export const securityMetricsData = [
  { month: "Jan", compliance: 75, security: 72, protection: 68 },
  { month: "Feb", compliance: 78, security: 75, protection: 71 },
  { month: "Mar", compliance: 82, security: 79, protection: 75 },
  { month: "Apr", compliance: 85, security: 82, protection: 78 },
  { month: "May", compliance: 88, security: 85, protection: 82 },
  { month: "Jun", compliance: 90, security: 88, protection: 85 },
]

export const mfaAdoptionData = [
  { period: "Week 1", enrolled: 240, notEnrolled: 160 },
  { period: "Week 2", enrolled: 320, notEnrolled: 180 },
  { period: "Week 3", enrolled: 420, notEnrolled: 80 },
  { period: "Week 4", enrolled: 520, notEnrolled: 30 },
]

export const incidentSeverityData = [
  { severity: "Critical", count: 5, fill: "#dc2626" },
  { severity: "High", count: 12, fill: "#f97316" },
  { severity: "Medium", count: 28, fill: "#eab308" },
  { severity: "Low", count: 45, fill: "#22c55e" },
]

export const deviceComplianceData = [
  { name: "Compliant", value: 156, fill: "#10b981" },
  { name: "Non-Compliant", value: 34, fill: "#ef4444" },
  { name: "Pending", value: 20, fill: "#f59e0b" },
]

export const controlStatusData = [
  { type: "Implemented", count: 45, fill: "#10b981" },
  { type: "In Progress", count: 23, fill: "#3b82f6" },
  { type: "Not Started", count: 12, fill: "#6b7280" },
]

export const vendorRiskData = [
  { vendor: "EdTech A", riskScore: 25, status: "Low" },
  { vendor: "EdTech B", riskScore: 45, status: "Medium" },
  { vendor: "EdTech C", riskScore: 18, status: "Low" },
  { vendor: "EdTech D", riskScore: 62, status: "High" },
  { vendor: "EdTech E", riskScore: 38, status: "Medium" },
]

export const nistDomainsData = [
  { domain: "Identify", score: 85, status: "Strong" },
  { domain: "Protect", score: 82, status: "Strong" },
  { domain: "Detect", score: 78, status: "Good" },
  { domain: "Respond", score: 80, status: "Good" },
  { domain: "Recover", score: 75, status: "Good" },
]

export const incidentTimelineData = [
  {
    id: 1,
    title: "Suspicious Login Detected",
    description: "IP address from unknown location",
    timestamp: "2024-03-12 14:23:00",
    severity: "High",
    status: "Investigating",
  },
  {
    id: 2,
    title: "Failed Authentication Attempt",
    description: "Multiple failed MFA challenges",
    timestamp: "2024-03-12 13:45:00",
    severity: "Medium",
    status: "Resolved",
  },
  {
    id: 3,
    title: "Data Export Detected",
    description: "Unusual data movement from secure zone",
    timestamp: "2024-03-12 11:20:00",
    severity: "Critical",
    status: "Escalated",
  },
]

export const auditLogData = [
  {
    id: 1,
    actor: "admin@school.edu",
    action: "User Created",
    resource: "john.doe@school.edu",
    timestamp: "2024-03-12 14:30:00",
    status: "Success",
  },
  {
    id: 2,
    actor: "security@school.edu",
    action: "Policy Updated",
    resource: "Password Policy",
    timestamp: "2024-03-12 13:15:00",
    status: "Success",
  },
  {
    id: 3,
    actor: "admin@school.edu",
    action: "Role Assigned",
    resource: "Teacher",
    timestamp: "2024-03-12 12:00:00",
    status: "Success",
  },
]

export const accessLogsData = [
  {
    id: 1,
    user: "john.doe@school.edu",
    action: "LOGIN",
    resource: "Dashboard",
    ipAddress: "192.168.1.100",
    timestamp: "2024-03-12 14:45:00",
    status: "Success",
  },
  {
    id: 2,
    user: "jane.smith@school.edu",
    action: "FILE_ACCESS",
    resource: "Student Records",
    ipAddress: "192.168.1.105",
    timestamp: "2024-03-12 14:30:00",
    status: "Success",
  },
  {
    id: 3,
    user: "admin@school.edu",
    action: "POLICY_UPDATE",
    resource: "Security Policy",
    ipAddress: "192.168.1.50",
    timestamp: "2024-03-12 14:15:00",
    status: "Success",
  },
]

export const userRoleDistributionData = [
  { role: "Administrator", count: 5, fill: "#dc2626" },
  { role: "Security Officer", count: 8, fill: "#f97316" },
  { role: "Teacher", count: 45, fill: "#3b82f6" },
  { role: "Staff", count: 12, fill: "#10b981" },
]

export const deviceOsDistributionData = [
  { os: "Windows", count: 95, fill: "#0ea5e9" },
  { os: "macOS", count: 42, fill: "#6366f1" },
  { os: "iOS", count: 67, fill: "#06b6d4" },
  { os: "Android", count: 58, fill: "#10b981" },
  { os: "Other", count: 18, fill: "#8b5cf6" },
]

export const complianceScoreData = [
  { domain: "Access Control", score: 92 },
  { domain: "Data Protection", score: 88 },
  { domain: "Incident Response", score: 85 },
  { domain: "Risk Management", score: 80 },
  { domain: "Security Awareness", score: 78 },
]

export const failedLoginAttemptsData = [
  { hour: "00:00", attempts: 2, successful: 150 },
  { hour: "04:00", attempts: 1, successful: 140 },
  { hour: "08:00", attempts: 5, successful: 280 },
  { hour: "12:00", attempts: 12, successful: 450 },
  { hour: "16:00", attempts: 18, successful: 520 },
  { hour: "20:00", attempts: 8, successful: 380 },
  { hour: "24:00", attempts: 3, successful: 200 },
]

export const policyComplianceData = [
  { policy: "Password Policy", compliant: 95, nonCompliant: 5 },
  { policy: "MFA Requirement", compliant: 87, nonCompliant: 13 },
  { policy: "Data Classification", compliant: 82, nonCompliant: 18 },
  { policy: "Encryption Standard", compliant: 90, nonCompliant: 10 },
]

export const assessmentProgressData = [
  { category: "Technical Controls", completed: 34, total: 40 },
  { category: "Administrative Controls", completed: 28, total: 35 },
  { category: "Physical Controls", completed: 18, total: 20 },
  { category: "Legal/Compliance", completed: 15, total: 18 },
]
