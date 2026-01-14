"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { User, LogOut, Home, Calendar, UserCircle } from "lucide-react"

export function StudentHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-[#1e293b] border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/student/dashboard" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
            <Home className="h-5 w-5" />
            <span className="font-semibold">Student Portal</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/student/attendance"
              className="text-slate-400 hover:text-blue-400 transition-colors font-medium"
            >
              Attendance
            </Link>
            <Link
              href="/student/profile"
              className="text-slate-400 hover:text-blue-400 transition-colors font-medium"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <UserCircle className="h-4 w-4" />
            <span>{user?.name || user?.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 border-slate-600 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
