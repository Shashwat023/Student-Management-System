"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedCard } from "@/components/animations/animated-card"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StudentHeader } from "@/components/features/student/header"
import { Loader2, BookOpen, Calendar, User, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0f172a]">
        <StudentHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <AnimatedCard delay={0}>
                <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="h-6 w-6 text-blue-200 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Profile</h3>
                  </div>
                  <p className="text-xl font-semibold text-white mt-3 group-hover:text-blue-100 transition-colors">{user?.email}</p>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.1}>
                <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-800 border-green-500 shadow-lg shadow-green-500/20 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="flex items-center space-x-3 mb-2">
                    <BookOpen className="h-6 w-6 text-green-200 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Enrolled Subjects</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mt-3 group-hover:scale-110 transition-transform">6</p>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <Card className="p-8 bg-gradient-to-br from-orange-600 to-amber-800 border-orange-500 shadow-lg shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="h-6 w-6 text-orange-200 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Attendance Rate</h3>
                  </div>
                  <p className="text-3xl font-bold text-white mt-3 group-hover:scale-110 transition-transform">92%</p>
                </Card>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedCard delay={0.3}>
                <Card className="p-8 bg-[#1e293b] border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  </div>
                  <div className="space-y-4 mt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-500 bg-blue-600/10 text-blue-300 hover:bg-blue-600/30 hover:border-blue-400 hover:scale-105 transition-all duration-200"
                      onClick={() => router.push('/student/attendance')}
                    >
                      View Attendance
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-purple-500 bg-purple-600/10 text-purple-300 hover:bg-purple-600/30 hover:border-purple-400 hover:scale-105 transition-all duration-200"
                      onClick={() => router.push('/student/profile')}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </Card>
              </AnimatedCard>

              <AnimatedCard delay={0.4}>
                <Card className="p-8 bg-[#1e293b] border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                  </div>
                  <div className="space-y-3 text-sm text-slate-400 mt-2">
                    <p>• Attendance marked for Data Structures</p>
                    <p>• Profile updated yesterday</p>
                    <p>• New subject enrolled: Machine Learning</p>
                  </div>
                </Card>
              </AnimatedCard>
            </div>
          </StaggerContainer>
        </main>
      </div>
    </PageTransition>
  )
}
