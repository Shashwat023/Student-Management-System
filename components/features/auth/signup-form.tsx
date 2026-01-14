"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from "lucide-react"

const COURSES = ["CSE", "AIDS", "ECE", "ME", "CE"]
const BRANCHES = ["Engineering", "Science", "Arts"]

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    rollNumber: "",
    course: "",
    branch: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signup } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (Object.values(formData).some((v) => !v)) {
      setError("All fields are required")
      return
    }

    setLoading(true)

    try {
      await signup(formData)
      router.push("/student/dashboard")
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-[#1e293b] border-slate-700">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2 text-white">Create Student Account</h1>
        <p className="text-slate-400 mb-6">Register to access the platform</p>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">College Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber" className="text-slate-300">Roll Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              placeholder="CS001"
              value={formData.rollNumber}
              onChange={handleChange}
              disabled={loading}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course" className="text-slate-300">Course</Label>
              <Select value={formData.course} onValueChange={(value) => handleSelectChange("course", value)}>
                <SelectTrigger id="course" disabled={loading} className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-slate-300">Branch</Label>
              <Select value={formData.branch} onValueChange={(value) => handleSelectChange("branch", value)}>
                <SelectTrigger id="branch" disabled={loading} className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-400">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </Card>
  )
}
