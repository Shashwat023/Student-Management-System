"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PasswordStrengthIndicator } from "@/components/features/auth/password-strength-indicator"
import { validatePassword } from "@/lib/password-utils"
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset link.")
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate password
        const validation = validatePassword(newPassword)
        if (!validation.valid) {
            setError(validation.message || "Invalid password")
            return
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (!token) {
            setError("Invalid reset token")
            return
        }

        setIsLoading(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resetToken: token,
                    newPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password")
            }

            setIsSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
                <Card className="w-full max-w-md bg-[#1e293b] border-slate-700">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                        <CardTitle className="text-2xl text-white">Password Reset Successful!</CardTitle>
                        <CardDescription className="text-slate-400">Your password has been successfully reset.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-blue-500/10 border-blue-500/50">
                            <AlertDescription className="text-slate-300">Redirecting to login page in 3 seconds...</AlertDescription>
                        </Alert>

                        <Link href="/auth/login" className="block">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Go to Login</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <Card className="w-full max-w-md bg-[#1e293b] border-slate-700">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Reset Your Password</CardTitle>
                    <CardDescription className="text-slate-400">Enter your new password below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                                <AlertDescription className="text-red-400">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={isLoading || !token}
                                    className="pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <PasswordStrengthIndicator password={newPassword} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading || !token}
                                    className="pr-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-sm text-red-400">Passwords do not match</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading || !token}>
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Reset Password
                                </>
                            )}
                        </Button>

                        <div className="text-center text-sm text-slate-400">
                            <Link href="/auth/login" className="hover:text-slate-300 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
