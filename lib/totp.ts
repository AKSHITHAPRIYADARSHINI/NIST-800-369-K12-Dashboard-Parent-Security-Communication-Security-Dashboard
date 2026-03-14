import speakeasy from "speakeasy"
import QRCode from "qrcode"

export function generateTOTPSecret(email: string) {
  return speakeasy.generateSecret({
    name: `NIST Dashboard (${email})`,
    issuer: "Springvale School District",
    length: 32,
  })
}

export async function generateQRCodeURL(
  secret: string,
  email: string
): Promise<string> {
  const otpauth_url = speakeasy.otpauthURL({
    secret,
    label: `NIST Dashboard (${email})`,
    issuer: "Springvale School District",
    encoding: "base32",
  })

  return QRCode.toDataURL(otpauth_url)
}

export function verifyTOTP(
  token: string,
  secret: string,
  window: number = 2
): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window,
  })
}

export function generateRecoveryCodes(count: number = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    codes.push(code)
  }
  return codes
}

export function maskSecret(secret: string): string {
  const visible = secret.substring(0, 4)
  const hidden = "*".repeat(secret.length - 8)
  const end = secret.substring(secret.length - 4)
  return `${visible}${hidden}${end}`
}
