"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send reset email")
            }

            setIsSuccess(true)
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
                        <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
                        <CardDescription className="text-slate-400">
                            We've sent password reset instructions to <strong className="text-slate-300">{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-blue-500/10 border-blue-500/50">
                            <Mail className="h-4 w-4 text-blue-400" />
                            <AlertDescription className="text-slate-300">
                                Click the link in the email to reset your password. The link will expire in 1 hour.
                            </AlertDescription>
                        </Alert>

                        <div className="text-center text-sm text-slate-400">
                            <p>Didn't receive the email? Check your spam folder or</p>
                            <Button
                                variant="link"
                                className="p-0 h-auto font-normal text-blue-400 hover:text-blue-300"
                                onClick={() => {
                                    setIsSuccess(false)
                                    setEmail("")
                                }}
                            >
                                try again
                            </Button>
                        </div>

                        <Link href="/auth/login" className="block">
                            <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
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
                    <CardTitle className="text-2xl text-white">Forgot Password?</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                                <AlertDescription className="text-red-400">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Send Reset Link
                                </>
                            )}
                        </Button>

                        <div className="text-center">
                            <Link href="/auth/login">
                                <Button variant="link" className="text-sm text-slate-400 hover:text-slate-300">
                                    <ArrowLeft className="w-3 h-3 mr-1" />
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
