"use client"

import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/features/admin/sidebar"
import { AttendanceForm } from "@/components/features/admin/attendance-form"
import { AttendanceAnalytics } from "@/components/features/admin/attendance-analytics"
import { Button } from "@/components/ui/button"

export default function AttendancePage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#1e293b] border-b border-slate-700 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
          <p className="text-slate-400 mt-1">Mark and track student attendance</p>
        </header>

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div />
            <Button onClick={() => router.push("/admin/attendance/history")} variant="outline" className="border-blue-500 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20">
              View History
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttendanceForm />
            </div>

            <div>
              <AttendanceAnalytics />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
