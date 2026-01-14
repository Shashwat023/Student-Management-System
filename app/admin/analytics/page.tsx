"use client"

import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/features/admin/sidebar"
import { AdvancedAnalytics } from "@/components/features/admin/advanced-analytics"

export default function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-white">Advanced Analytics</h1>
          <p className="text-slate-400 mt-1">Department insights, trends, and performance metrics</p>
        </header>

        <main className="p-6">
          <AdvancedAnalytics />
        </main>
      </div>
    </div>
  )
}
