"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert as ShadcnAlert, AlertDescription } from "@/components/ui/alert" // Renamed to avoid conflict
import { Loader2 } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import { apiClient } from "@/lib/api-client"
import { Snackbar, Alert } from "@mui/material"
import OtpVerifyPage from "@/components/features/auth/otp-verify"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showOtpPage, setShowOtpPage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    try {
      // Step 1: Request OTP
      await apiClient.auth.requestLoginOtp(email, password)
      // Show OTP verification page
      setShowOtpPage(true)
    } catch (error: any) {
      setErrorMessage("Wrong email or password")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMessage("")
    setLoading(true)

    try {
      const response = await apiClient.auth.googleAuth(credentialResponse.credential, "admin")

      // Store all required auth data
      localStorage.setItem("adminToken", response.accessToken)
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      localStorage.setItem("userId", response.user._id || response.user.id)
      localStorage.setItem("email", response.user.email)
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("role", "admin")

      router.push("/admin/dashboard")
    } catch (err: any) {
      setErrorMessage(err.message || "Google login failed. Please try again.")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  // Show OTP verification page if OTP was requested
  if (showOtpPage) {
    return (
      <OtpVerifyPage
        email={email}
        onBack={() => setShowOtpPage(false)}
        role="admin"
      />
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Card className="w-full max-w-md bg-[#1e293b] border-slate-700">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-400 mb-6">Sign in to admin portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Admin Portal"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1e293b] text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMessage("Google login failed")}
              theme="filled_blue"
              size="large"
              width="384px"
            />
          </div>

          {/* Don't have an account */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-orange-400 hover:text-orange-300 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Back to Portal Selection */}
          <div className="mt-2 text-center">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
            >
              ← Back to Portal Selection
            </Link>
          </div>
        </div>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  )
}
