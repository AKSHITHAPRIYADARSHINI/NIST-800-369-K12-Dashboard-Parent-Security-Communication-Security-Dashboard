"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center">{error.message || "An unexpected error occurred while loading the dashboard."}</p>
      <Button onClick={reset} className="mt-4">
        Try again
      </Button>
    </div>
  )
}
