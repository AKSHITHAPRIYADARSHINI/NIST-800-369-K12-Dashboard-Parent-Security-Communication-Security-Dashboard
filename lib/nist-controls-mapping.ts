export interface NISTControlMapping {
  id: number
  domain: string
  domain800369: string
  control800171?: string
  control80053?: string
  maturityScore: 0 | 1 | 2 | 3 | 4
  status: "Not Started" | "Planned" | "Partial" | "Implemented" | "Optimized"
  description: string
  evidence?: string
  lastReviewDate: string
}

export const NIST_CONTROL_MAPPINGS: NISTControlMapping[] = [
  // Authentication Domain (A)
  {
    id: 1,
    domain: "Authentication",
    domain800369: "A - Identification & Authentication",
    control800171: "IA-2 Authentication",
    control80053: "IA-2 Authentication (Enhanced)",
    maturityScore: 3,
    status: "Implemented",
    description: "Multi-factor authentication (MFA) for all users accessing student systems",
    evidence: "MFA enabled on 95% of staff accounts, compliance audit passed",
    lastReviewDate: "2026-02-15",
  },
  {
    id: 2,
    domain: "Authentication",
    domain800369: "A - Identification & Authentication",
    control800171: "IA-4 Identifier Management",
    control80053: "IA-4 Identifier Management",
    maturityScore: 3,
    status: "Implemented",
    description: "User account lifecycle management and access provisioning",
    evidence: "Identity management system deployed, quarterly reviews scheduled",
    lastReviewDate: "2026-02-10",
  },
  {
    id: 3,
    domain: "Authentication",
    domain800369: "A - Identification & Authentication",
    control800171: "IA-5 Authentication Strength",
    control80053: "IA-5 Authentication Mechanisms",
    maturityScore: 2,
    status: "Partial",
    description: "Password complexity and strength requirements",
    evidence: "Policy implemented, 85% compliance rate, upgrading legacy systems",
    lastReviewDate: "2026-02-20",
  },
  {
    id: 4,
    domain: "Authentication",
    domain800369: "A - Identification & Authentication",
    control800171: "AC-2 Account Management",
    control80053: "AC-2 Account Management",
    maturityScore: 3,
    status: "Implemented",
    description: "Privileged account access management and monitoring",
    evidence: "PAM solution deployed, access reviews completed quarterly",
    lastReviewDate: "2026-01-30",
  },

  // Data Protection Domain (W)
  {
    id: 5,
    domain: "Data Protection",
    domain800369: "W - Data Classification & Protection",
    control800171: "SC-28 Protection of Information at Rest",
    control80053: "SC-28 Protection of Information at Rest",
    maturityScore: 3,
    status: "Implemented",
    description: "Encryption of student data at rest on all systems",
    evidence: "AES-256 encryption implemented, 100% of student records encrypted",
    lastReviewDate: "2026-02-18",
  },
  {
    id: 6,
    domain: "Data Protection",
    domain800369: "W - Data Classification & Protection",
    control800171: "SC-7 Boundary Protection",
    control80053: "SC-7 Boundary Protection",
    maturityScore: 3,
    status: "Implemented",
    description: "TLS/SSL encryption for data in transit",
    evidence: "HTTPS enforced on all web applications, TLS 1.2+",
    lastReviewDate: "2026-02-12",
  },
  {
    id: 7,
    domain: "Data Protection",
    domain800369: "W - Data Classification & Protection",
    control800171: "DM-1 Data Minimization",
    control80053: "SC-44 Deactivation of Wireless Access Points",
    maturityScore: 2,
    status: "Partial",
    description: "Student data classification and handling procedures",
    evidence: "Classification policy adopted, training at 72% completion",
    lastReviewDate: "2026-02-25",
  },
  {
    id: 8,
    domain: "Data Protection",
    domain800369: "W - Data Classification & Protection",
    control800171: "MP-2 Media Protection",
    control80053: "MP-2 Media Protection",
    maturityScore: 3,
    status: "Implemented",
    description: "Protection of portable media containing student data",
    evidence: "Encrypted USB drives in use, media wiping procedures documented",
    lastReviewDate: "2026-02-08",
  },

  // Device Security Domain (S)
  {
    id: 9,
    domain: "Device Security",
    domain800369: "S - System & Information Integrity",
    control800171: "SI-2 Flaw Remediation",
    control80053: "SI-2 Flaw Remediation",
    maturityScore: 2,
    status: "Partial",
    description: "Patch management and system updates",
    evidence: "Automated patching deployed, 82% compliance on schedule",
    lastReviewDate: "2026-02-22",
  },
  {
    id: 10,
    domain: "Device Security",
    domain800369: "S - System & Information Integrity",
    control800171: "SI-3 Malicious Code Protection",
    control80053: "SI-3 Malicious Code Protection",
    maturityScore: 3,
    status: "Implemented",
    description: "Antivirus and anti-malware protection",
    evidence: "Endpoint protection on 98% of devices, real-time scanning enabled",
    lastReviewDate: "2026-02-16",
  },
  {
    id: 11,
    domain: "Device Security",
    domain800369: "S - System & Information Integrity",
    control800171: "CM-7 Least Functionality",
    control80053: "CM-7 Least Functionality",
    maturityScore: 2,
    status: "Partial",
    description: "System hardening and configuration management",
    evidence: "Hardening baselines defined, 70% deployment completed",
    lastReviewDate: "2026-02-19",
  },
  {
    id: 12,
    domain: "Device Security",
    domain800369: "S - System & Information Integrity",
    control800171: "SI-4 System Monitoring",
    control80053: "SI-4 Information System Monitoring",
    maturityScore: 3,
    status: "Implemented",
    description: "Device inventory and compliance monitoring",
    evidence: "MDM/EMM solution deployed, 95% device compliance",
    lastReviewDate: "2026-02-14",
  },

  // Vendor Security Domain (X)
  {
    id: 13,
    domain: "Vendor Security",
    domain800369: "X - Third-Party Security & Vendor Management",
    control800171: "SA-9 External Information System Services",
    control80053: "SA-9 External Information System Services",
    maturityScore: 2,
    status: "Partial",
    description: "Vendor security assessments and due diligence",
    evidence: "Assessment framework deployed, 82% of vendors reviewed",
    lastReviewDate: "2026-02-17",
  },
  {
    id: 14,
    domain: "Vendor Security",
    domain800369: "X - Third-Party Security & Vendor Management",
    control800171: "SA-4 Acquisition Process",
    control80053: "SA-4 Acquisition Process",
    maturityScore: 2,
    status: "Partial",
    description: "Security requirements in vendor contracts",
    evidence: "Security clauses added to 75% of contracts, standardizing others",
    lastReviewDate: "2026-02-13",
  },
  {
    id: 15,
    domain: "Vendor Security",
    domain800369: "X - Third-Party Security & Vendor Management",
    control800171: "SA-9 External Information System Services",
    control80053: "SA-3 System Development Life Cycle",
    maturityScore: 2,
    status: "Partial",
    description: "Monitoring and management of third-party services",
    evidence: "Service monitoring framework in place, 70% of critical vendors",
    lastReviewDate: "2026-02-11",
  },
  {
    id: 16,
    domain: "Vendor Security",
    domain800369: "X - Third-Party Security & Vendor Management",
    control800171: "SC-7 Boundary Protection",
    control80053: "SC-7 Boundary Protection",
    maturityScore: 3,
    status: "Implemented",
    description: "Access controls for vendor connections",
    evidence: "Vendor VPN access controlled, MFA required, quarterly audits",
    lastReviewDate: "2026-02-09",
  },

  // Incident Monitoring Domain (IR)
  {
    id: 17,
    domain: "Incident Monitoring",
    domain800369: "IR - Incident Response & Detection",
    control800171: "IR-4 Incident Handling",
    control80053: "IR-4 Incident Handling",
    maturityScore: 3,
    status: "Implemented",
    description: "Incident detection and response procedures",
    evidence: "SIEM deployed, incident response team trained, 99% detection rate",
    lastReviewDate: "2026-02-20",
  },
  {
    id: 18,
    domain: "Incident Monitoring",
    domain800369: "IR - Incident Response & Detection",
    control800171: "AU-12 Audit and Accountability",
    control80053: "AU-12 Audit Generation",
    maturityScore: 3,
    status: "Implemented",
    description: "Audit logging and security event monitoring",
    evidence: "Centralized logging deployed, 90-day retention, quarterly reviews",
    lastReviewDate: "2026-02-15",
  },
  {
    id: 19,
    domain: "Incident Monitoring",
    domain800369: "IR - Incident Response & Detection",
    control800171: "IR-6 Incident Reporting",
    control80053: "IR-6 Incident Reporting",
    maturityScore: 3,
    status: "Implemented",
    description: "Incident notification and reporting procedures",
    evidence: "Breach notification policy implemented, tested annually",
    lastReviewDate: "2026-02-12",
  },
  {
    id: 20,
    domain: "Incident Monitoring",
    domain800369: "IR - Incident Response & Detection",
    control800171: "CP-4 Contingency Plan Testing",
    control80053: "CP-4 Contingency Plan Testing",
    maturityScore: 2,
    status: "Partial",
    description: "Business continuity and disaster recovery testing",
    evidence: "DR plan documented, tabletop exercises completed, technical testing in progress",
    lastReviewDate: "2026-02-18",
  },

  // Compliance Domain (C)
  {
    id: 21,
    domain: "Compliance",
    domain800369: "C - Compliance & Assessment",
    control800171: "CA-2 Security Assessments",
    control80053: "CA-2 Security Assessments",
    maturityScore: 3,
    status: "Implemented",
    description: "Regular security assessments and audits",
    evidence: "Annual third-party assessment completed, findings tracked",
    lastReviewDate: "2026-01-25",
  },
  {
    id: 22,
    domain: "Compliance",
    domain800369: "C - Compliance & Assessment",
    control800171: "CA-7 Continuous Monitoring",
    control80053: "CA-7 Continuous Monitoring",
    maturityScore: 2,
    status: "Partial",
    description: "Continuous compliance monitoring",
    evidence: "Automated scanning deployed for 75% of systems, expanding",
    lastReviewDate: "2026-02-21",
  },
  {
    id: 23,
    domain: "Compliance",
    domain800369: "C - Compliance & Assessment",
    control800171: "PS-6 Access Termination",
    control80053: "PS-4 Personnel Termination",
    maturityScore: 3,
    status: "Implemented",
    description: "Employee access removal and offboarding procedures",
    evidence: "Automated offboarding workflow, verified completion rate 100%",
    lastReviewDate: "2026-02-19",
  },
  {
    id: 24,
    domain: "Compliance",
    domain800369: "C - Compliance & Assessment",
    control800171: "AT-1 Security Awareness Training",
    control80053: "AT-1 Security Awareness and Training",
    maturityScore: 2,
    status: "Partial",
    description: "Security awareness and training programs",
    evidence: "Annual training required, 85% completion rate, updating curriculum",
    lastReviewDate: "2026-02-16",
  },
]

export function getControlsByDomain(domain: string): NISTControlMapping[] {
  return NIST_CONTROL_MAPPINGS.filter((mapping) => mapping.domain === domain)
}

export function getDomainSummary(domain: string) {
  const controls = getControlsByDomain(domain)
  const implemented = controls.filter(
    (c) => c.status === "Implemented" || c.status === "Optimized"
  ).length
  const total = controls.length
  const avgMaturity = Math.round(controls.reduce((sum, c) => sum + c.maturityScore, 0) / total)

  return {
    domain,
    total,
    implemented,
    implementationPercentage: Math.round((implemented / total) * 100),
    averageMaturity: avgMaturity,
    controls,
  }
}

export function getAllDomainSummaries() {
  const domains = ["Authentication", "Data Protection", "Device Security", "Vendor Security", "Incident Monitoring", "Compliance"]
  return domains.map((domain) => getDomainSummary(domain))
}

export function getOverallComplianceScore() {
  const summaries = getAllDomainSummaries()
  const totalImplemented = summaries.reduce((sum, s) => sum + s.implemented, 0)
  const totalControls = summaries.reduce((sum, s) => sum + s.total, 0)
  return Math.round((totalImplemented / totalControls) * 100)
}
