"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NIST_CONTROL_MAPPINGS, getDomainSummary, getAllDomainSummaries } from "@/lib/nist-controls-mapping"

function getStatusIcon(status: string) {
  switch (status) {
    case "Implemented":
    case "Optimized":
      return <CheckCircle className="size-4 text-green-500" />
    case "Partial":
      return <Clock className="size-4 text-yellow-500" />
    case "Planned":
      return <Clock className="size-4 text-blue-500" />
    case "Not Started":
      return <AlertTriangle className="size-4 text-red-500" />
    default:
      return null
  }
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Implemented":
    case "Optimized":
      return "default"
    case "Partial":
      return "secondary"
    case "Planned":
      return "secondary"
    case "Not Started":
      return "destructive"
    default:
      return "outline"
  }
}

function getMaturityColor(score: number): string {
  switch (score) {
    case 4:
      return "text-green-600 font-bold"
    case 3:
      return "text-green-500"
    case 2:
      return "text-yellow-500"
    case 1:
      return "text-blue-500"
    case 0:
      return "text-red-500"
    default:
      return "text-gray-500"
  }
}

export function NISTMappingTable() {
  const domains = getAllDomainSummaries()

  return (
    <div className="space-y-6">
      {/* Domain Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain) => (
          <Card key={domain.domain}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{domain.domain}</CardTitle>
              <CardDescription className="text-xs">
                {domain.implemented} of {domain.total} controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold text-blue-600">
                {domain.implementationPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Maturity: Level {domain.averageMaturity}/4</p>
                <p className="mt-1">
                  {domain.implemented === domain.total
                    ? "✓ All controls implemented"
                    : `${domain.total - domain.implemented} controls pending`}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Control Mapping by Domain */}
      <Card>
        <CardHeader>
          <CardTitle>NIST Control Framework Mapping</CardTitle>
          <CardDescription>
            Detailed mapping of NIST-800-369 domains to NIST-800-53 and NIST-800-171 controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Authentication" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {["Authentication", "Data Protection", "Device Security", "Vendor Security", "Incident Monitoring", "Compliance"].map(
                (domain) => (
                  <TabsTrigger key={domain} value={domain} className="text-xs">
                    {domain.split(" ")[0]}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            {domains.map((domainSummary) => (
              <TabsContent key={domainSummary.domain} value={domainSummary.domain} className="mt-4">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="text-xs">Control</TableHead>
                        <TableHead className="text-xs">NIST-800-171</TableHead>
                        <TableHead className="text-xs">NIST-800-53</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs text-right">Maturity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {domainSummary.controls.map((control) => (
                        <TableRow key={control.id} className="hover:bg-muted/50">
                          <TableCell className="text-xs font-medium max-w-xs">
                            <div className="flex items-start gap-2">
                              {getStatusIcon(control.status)}
                              <span>{control.description}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">{control.control800171 || "—"}</TableCell>
                          <TableCell className="text-xs">{control.control80053 || "—"}</TableCell>
                          <TableCell className="text-xs">
                            <Badge variant={getStatusBadgeVariant(control.status)} className="text-xs">
                              {control.status}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-xs text-right font-medium ${getMaturityColor(control.maturityScore)}`}>
                            {control.maturityScore}/4
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Domain Details */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Implementation Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-bold text-green-600">{domainSummary.implemented}/{domainSummary.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-bold text-blue-600">{domainSummary.implementationPercentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Maturity</span>
                        <span className="font-bold">Level {domainSummary.averageMaturity}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {domainSummary.controls
                          .filter((c) => c.status !== "Implemented" && c.status !== "Optimized")
                          .slice(0, 3)
                          .map((c, idx) => (
                            <li key={idx} className="text-xs">
                              • {c.description.substring(0, 40)}...
                            </li>
                          ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Framework Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">NIST Framework Reference</CardTitle>
          <CardDescription>Understanding the framework components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-sm mb-2">NIST-800-369</h4>
              <p className="text-xs text-muted-foreground">
                Youth Cybersecurity Framework specifically designed for K-12 educational institutions.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-sm mb-2">NIST-800-171</h4>
              <p className="text-xs text-muted-foreground">
                Controlled Unclassified Information (CUI) protection controls, applicable to education data.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-sm mb-2">NIST-800-53</h4>
              <p className="text-xs text-muted-foreground">
                Security and Privacy Controls for Information Systems - comprehensive control families.
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-3">Maturity Levels</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex gap-2">
                <span className="font-mono bg-red-100 text-red-700 px-2 py-1 rounded w-8 text-center">0</span>
                <span>Not Started - No implementation</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded w-8 text-center">1</span>
                <span>Planned - Requirements documented, not yet implemented</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-yellow-100 text-yellow-700 px-2 py-1 rounded w-8 text-center">2</span>
                <span>Partial - Partially implemented, gaps remain</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded w-8 text-center">3</span>
                <span>Implemented - Fully deployed and operational</span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded w-8 text-center">4</span>
                <span>Optimized - Monitored, maintained, and continuously improved</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
