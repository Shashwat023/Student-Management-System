"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { StudentHeader } from "@/components/features/student/header"
import { ProfileSection } from "@/components/features/student/profile-section"
import { Loader2 } from "lucide-react"

interface StudentProfile {
  name: string
  rollNumber: string
  collegeEmail: string
  course: string
  branch: string
  cgpa: number
}

const mockProfile: StudentProfile = {
  name: "John Doe",
  rollNumber: "CS001",
  collegeEmail: "john@college.edu",
  course: "CSE",
  branch: "Engineering",
  cgpa: 3.85,
}

export default function StudentProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [mounted, loading, isAuthenticated, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <StudentHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileSection profile={mockProfile} />
      </div>
    </main>
  )
}
