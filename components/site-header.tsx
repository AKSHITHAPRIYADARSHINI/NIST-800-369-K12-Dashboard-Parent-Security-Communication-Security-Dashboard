import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 py-3 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-lg font-semibold">NIST 800-369 Security Dashboard</h1>
        <span className="text-xs text-muted-foreground">K-12 Cybersecurity Framework</span>
      </div>
    </header>
  )
}
