"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Users, Calendar, BarChart3, BookOpen, Settings } from "lucide-react"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear admin tokens
    localStorage.removeItem("adminToken")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("adminEmail")

    // Redirect to admin login
    router.push("/admin/login")
  }

  return (
    <header className="bg-[#1e293b] border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors">
            <Home className="h-5 w-5" />
            <span className="font-semibold">Admin Portal</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin/attendance"
              className="text-slate-400 hover:text-orange-400 transition-colors font-medium"
            >
              Attendance
            </Link>
            <Link
              href="/admin/students"
              className="text-slate-400 hover:text-orange-400 transition-colors font-medium"
            >
              Students
            </Link>
            <Link
              href="/admin/subjects"
              className="text-slate-400 hover:text-orange-400 transition-colors font-medium"
            >
              Subjects
            </Link>
            <Link
              href="/admin/analytics"
              className="text-slate-400 hover:text-orange-400 transition-colors font-medium"
            >
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <Settings className="h-4 w-4" />
            <span>Administrator</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
