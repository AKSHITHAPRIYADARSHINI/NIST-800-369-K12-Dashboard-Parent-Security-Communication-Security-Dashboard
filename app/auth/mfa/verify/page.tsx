"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import { toast } from "sonner"

function MFAVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mfaType = searchParams.get("type") || "email_otp"

  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const email = typeof window !== "undefined" ? sessionStorage.getItem("mfa-email") : null

  useEffect(() => {
    // Auto-focus code input
    const input = document.getElementById("code-input")
    if (input) (input as HTMLInputElement).focus()
  }, [])

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  // Auto-format code input (only digits)
  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6)
    setCode(digits)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (code.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    setIsLoading(true)

    try {
      if (!email) {
        setError("Email not found. Please log in again.")
        router.push("/auth/login")
        return
      }

      const response = await fetch("/api/auth/mfa/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Verification failed")
        toast.error(data.error || "Verification failed")
        setIsLoading(false)
        return
      }

      // Clear session storage
      sessionStorage.removeItem("mfa-email")
      sessionStorage.removeItem("mfa-type")

      toast.success("Verification successful!")
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
      setIsLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    setError("")

    try {
      if (!email) {
        setError("Email not found")
        return
      }

      const response = await fetch("/api/auth/mfa/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to resend code")
        toast.error(data.error || "Failed to resend code")
        return
      }

      toast.success("Code resent to your email")
      setResendCountdown(30)
      setCode("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Multi-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the verification code sent to your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code-input">Verification Code</Label>
                <Input
                  id="code-input"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  disabled={isLoading}
                  maxLength={6}
                  className="text-center text-2xl letter-spacing tracking-widest font-mono"
                  required
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground">
                  {email && (
                    <>
                      Code sent to <strong>{email}</strong>
                    </>
                  )}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleResend}
                  disabled={resendLoading || resendCountdown > 0}
                >
                  {resendCountdown > 0 ? (
                    <>Resend ({resendCountdown}s)</>
                  ) : resendLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    sessionStorage.removeItem("mfa-email")
                    sessionStorage.removeItem("mfa-type")
                    router.push("/auth/login")
                  }}
                >
                  Back
                </Button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-900">
                <strong>Demo Code:</strong> For testing, use any 6-digit code.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function MFAVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <MFAVerifyContent />
    </Suspense>
  )
}
