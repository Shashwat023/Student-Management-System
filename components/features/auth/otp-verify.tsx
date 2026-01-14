"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, ArrowLeft, Mail } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Snackbar, Alert } from "@mui/material"

interface OtpVerifyPageProps {
    email: string
    onBack: () => void
    role?: "student" | "admin"
}

export default function OtpVerifyPage({ email, onBack, role = "student" }: OtpVerifyPageProps) {
    const router = useRouter()
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpCode = otp.join("")

        if (otpCode.length !== 6) {
            setErrorMessage("Please enter all 6 digits")
            setShowError(true)
            return
        }

        setLoading(true)

        try {
            const response = await apiClient.auth.verifyLoginOtp(email, otpCode)

            // Store tokens and user data
            localStorage.setItem("accessToken", response.accessToken)
            localStorage.setItem("refreshToken", response.refreshToken)
            localStorage.setItem("userId", response.user.id)
            localStorage.setItem("email", response.user.email)
            localStorage.setItem("role", response.user.role)

            // Hard redirect to ensure localStorage is read
            if (role === "admin") {
                window.location.href = "/admin/dashboard"
            } else {
                window.location.href = "/student/dashboard"
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Invalid OTP. Please try again.")
            setShowError(true)
            setOtp(["", "", "", "", "", ""])
            document.getElementById("otp-0")?.focus()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-full mb-4">
                            <Lock className="w-8 h-8 text-orange-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Enter Verification Code</h2>
                        <p className="text-slate-400 text-sm">
                            We've sent a 6-digit code to
                            <br />
                            <span className="text-orange-400 font-medium">{email}</span>
                        </p>
                    </div>

                    {/* OTP Input */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-slate-700/50 border-2 border-slate-600 rounded-lg text-white focus:border-orange-400 focus:outline-none transition-colors"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.join("").length !== 6}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify & Login"}
                        </button>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={onBack}
                            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Didn't receive the code?{" "}
                            <button className="text-orange-400 hover:text-orange-300 font-medium">
                                Resend OTP
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Error Snackbar */}
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
