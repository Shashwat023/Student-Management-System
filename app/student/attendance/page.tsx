"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StudentHeader } from "@/components/features/student/header"
import { Loader2, Calendar, TrendingUp } from "lucide-react"

export default function StudentAttendancePage() {
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
    <div className="min-h-screen bg-[#0f172a]">
      <StudentHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="h-6 w-6 text-blue-200" />
              <h3 className="text-lg font-semibold text-white">Total Classes</h3>
            </div>
            <p className="text-4xl font-bold text-white mt-2">42</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-800 border-green-500 shadow-lg shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-200" />
              <h3 className="text-lg font-semibold text-white">Attendance Rate</h3>
            </div>
            <p className="text-4xl font-bold text-white mt-2">92%</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-orange-600 to-amber-800 border-orange-500 shadow-lg shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="h-6 w-6 text-orange-200" />
              <h3 className="text-lg font-semibold text-white">This Month</h3>
            </div>
            <p className="text-4xl font-bold text-white mt-2">18/20</p>
          </Card>
        </div>

        <Card className="p-8 bg-[#1e293b] border-slate-700">
          <h3 className="text-xl font-semibold mb-6 text-white">Recent Attendance</h3>
          <div className="space-y-4">
            {[
              { date: "2024-01-15", subject: "Data Structures", status: "Present" },
              { date: "2024-01-14", subject: "DBMS", status: "Present" },
              { date: "2024-01-13", subject: "Data Structures", status: "Late" },
              { date: "2024-01-12", subject: "Machine Learning", status: "Present" },
              { date: "2024-01-11", subject: "DBMS", status: "Absent" },
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-slate-700 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div>
                  <p className="font-medium text-white">{record.subject}</p>
                  <p className="text-sm text-slate-400">{record.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.status === "Present"
                    ? "bg-green-600/20 text-green-300 border border-green-500/30"
                    : record.status === "Absent"
                      ? "bg-red-600/20 text-red-300 border border-red-500/30"
                      : "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30"
                  }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}
