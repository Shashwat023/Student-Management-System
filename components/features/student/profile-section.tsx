"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"

interface StudentProfile {
  name: string
  rollNumber: string
  collegeEmail: string
  course: string
  branch: string
  cgpa: number
}

export function ProfileSection({ profile }: { profile: StudentProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Student Profile</h2>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Profile updated successfully</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className={isEditing ? "space-y-4" : "space-y-3"}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-slate-600">Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={!isEditing ? "bg-slate-50 border-none" : ""}
            />
          </div>

          <div>
            <Label className="text-sm text-slate-600">Roll Number</Label>
            <Input
              name="rollNumber"
              value={formData.rollNumber}
              disabled={!isEditing || loading}
              className={!isEditing ? "bg-slate-50 border-none" : ""}
            />
          </div>

          <div>
            <Label className="text-sm text-slate-600">Course</Label>
            <Input
              name="course"
              value={formData.course}
              disabled={!isEditing || loading}
              className={!isEditing ? "bg-slate-50 border-none" : ""}
            />
          </div>

          <div>
            <Label className="text-sm text-slate-600">Branch</Label>
            <Input
              name="branch"
              value={formData.branch}
              disabled={!isEditing || loading}
              className={!isEditing ? "bg-slate-50 border-none" : ""}
            />
          </div>

          <div>
            <Label className="text-sm text-slate-600">College Email</Label>
            <Input
              name="collegeEmail"
              type="email"
              value={formData.collegeEmail}
              disabled={true}
              className="bg-slate-50 border-none"
            />
          </div>

          <div>
            <Label className="text-sm text-slate-600">CGPA</Label>
            <Input
              name="cgpa"
              type="number"
              step="0.01"
              value={formData.cgpa}
              disabled={true}
              className="bg-slate-50 border-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setFormData(profile)
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </Card>
  )
}
