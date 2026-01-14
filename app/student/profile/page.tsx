"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProfileSection } from "@/components/features/student/profile-section"
import { Button } from "@/components/ui/button"
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
  const { user, isAuthenticated, loading, logout } = useAuth()
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  return (
    <main className="min-h-screen bg-[#0f172a]">
      <nav className="bg-[#1e293b] shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Student Profile</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Back
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6">
          <ProfileSection profile={mockProfile} />
        </div>
      </div>
    </main>
  )
}
