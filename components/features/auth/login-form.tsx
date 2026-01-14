"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { Snackbar, Alert } from "@mui/material"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import { apiClient } from "@/lib/api-client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/student/dashboard")
    } catch (err: any) {
      setError("Wrong email or password")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("")
    setLoading(true)

    try {
      const response = await apiClient.auth.googleAuth(credentialResponse.credential, "student")

      // Store all required auth data
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      localStorage.setItem("userId", response.user._id || response.user.id)
      localStorage.setItem("email", response.user.email)
      localStorage.setItem("role", response.user.role || "student")

      router.push("/student/dashboard")
    } catch (err: any) {
      setError(err.message || "Google login failed. Please try again.")
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-md bg-[#1e293b] border-slate-700">
          <div className="p-8">
            <motion.h1
              className="text-2xl font-bold mb-2 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Student Login
            </motion.h1>
            <motion.p
              className="text-slate-400 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sign in to your account
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </motion.div>

              <motion.div
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              className="relative my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1e293b] text-slate-400">Or continue with</span>
              </div>
            </motion.div>

            {/* Google Login */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
                theme="filled_blue"
                size="large"
                width="384px"
              />
            </motion.div>

            <motion.div
              className="mt-6 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-400">
                Don't have an account?{" "}
                <a href="/auth/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
                  Sign up
                </a>
              </p>
            </motion.div>

            {/* Forgot Password and Back to Portal Links */}
            <motion.div
              className="mt-6 space-y-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
                >
                  ← Back to Portal Selection
                </Link>
              </div>
            </motion.div>
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
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </PageTransition>
  )
}
