"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp"

export default function EmailOTPCard({ userId }: { userId: string }) {
  const [otp, setOtp] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(900)
  // const [isResending, setIsResending] = useState<boolean>(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [resendCountdown, setResendCountdown] = useState<number>(0)

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const { mutate, isPending: isVerifying } = useVerifyOtp();

  // Handle OTP verification
  const handleVerify = () => {
    if (otp.length !== 6) return

    setVerificationStatus("idle")
    mutate({
      data: {
        userId,
        secret: otp,
      }
    }, {
      onSuccess: () => {
        setVerificationStatus("success")
        setTimeLeft(0)
      },
      onError: () => {
        setVerificationStatus("error")
        setOtp("")
      }
    })
  }

  // Handle OTP resend
  // const handleResend = () => {
  //   setIsResending(true)
  //
  //   // Simulate resend process
  //   setTimeout(() => {
  //     setTimeLeft(300) // Reset timer to 5 minutes
  //     setVerificationStatus("idle")
  //     setOtp("")
  //     setIsResending(false)
  //     setResendDisabled(true)
  //     setResendCountdown(60) // Disable resend for 60 seconds
  //   }, 1500)
  // }

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Timer for resend button cooldown
  useEffect(() => {
    // if (resendCountdown <= 0) {
    //   setResendDisabled(false)
    //   return
    // }

    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCountdown])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Verify your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to your email. Enter the code below to confirm your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "")
              if (value.length <= 6) {
                setOtp(value)
                setVerificationStatus("idle")
              }
            }}
            className={cn(
              "text-center text-lg tracking-widest",
              verificationStatus === "error" && "border-destructive",
            )}
            maxLength={6}
          />

          {verificationStatus === "error" && (
            <div className="flex items-center text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Invalid verification code. Please try again.</span>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Email verified successfully!</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Code expires in: {formatTime(timeLeft)}</span>
          </div>
          {/* <Button
            variant="link"
            size="sm"
            className="p-0 h-auto"
            onClick={handleResend}
            disabled={isResending || resendDisabled}
          >
            {resendDisabled ? `Resend in ${resendCountdown}s` : isResending ? "Sending..." : "Resend code"}
          </Button> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={otp.length !== 6 || isVerifying || verificationStatus === "success"}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>
      </CardFooter>
    </Card>
  )
}
