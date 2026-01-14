"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedCard } from "@/components/animations/animated-card"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { AdminHeader } from "@/components/features/admin/header"
import { Card } from "@/components/ui/card"
import { Loader2, Users, BookOpen, Clock } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  if (!mounted) {
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

  const stats = [
    {
      title: "Total Students",
      value: 450,
      icon: Users,
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-500",
      shadowColor: "shadow-blue-500/20",
      iconColor: "text-blue-200",
    },
    {
      title: "Active Subjects",
      value: 12,
      icon: BookOpen,
      color: "from-green-600 to-emerald-800",
      borderColor: "border-green-500",
      shadowColor: "shadow-green-500/20",
      iconColor: "text-green-200",
    },
    {
      title: "Today's Attendance",
      value: 87,
      icon: Clock,
      color: "from-orange-600 to-amber-800",
      borderColor: "border-orange-500",
      shadowColor: "shadow-orange-500/20",
      iconColor: "text-orange-200",
      suffix: "%",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0f172a]">
        <AdminHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon

                return (
                  <AnimatedCard key={stat.title} delay={index * 0.1}>
                    <Card className={`p-8 bg-gradient-to-br ${stat.color} ${stat.borderColor} shadow-lg ${stat.shadowColor} hover:shadow-2xl hover:${stat.shadowColor.replace('/20', '/40')} transition-all duration-300 hover:scale-105 cursor-pointer group`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{stat.title}</p>
                          <motion.p
                            className="text-4xl font-bold text-white mt-3 group-hover:scale-110 transition-transform"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                          >
                            {stat.value}
                            {stat.suffix}
                          </motion.p>
                        </div>
                        <motion.div
                          className={`p-4 rounded-lg ${stat.iconColor} group-hover:scale-110 transition-transform`}
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Icon className={`h-7 w-7 ${stat.iconColor}`} />
                        </motion.div>
                      </div>
                    </Card>
                  </AnimatedCard>
                )
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-[#1e293b] border-slate-700">
                <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { href: "/admin/attendance", icon: Clock, label: "Mark Attendance", color: "text-blue-600" },
                    { href: "/admin/students", icon: Users, label: "Manage Students", color: "text-green-600" },
                    { href: "/admin/subjects", icon: BookOpen, label: "Manage Subjects", color: "text-amber-600" },
                  ].map((action, index) => {
                    const ActionIcon = action.icon

                    return (
                      <motion.a
                        key={action.href}
                        href={action.href}
                        className="p-6 border-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all text-center border-orange-500/30 hover:border-orange-500/80 shadow-lg hover:shadow-orange-500/30 hover:scale-105 duration-300"
                        whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ActionIcon className={`h-6 w-6 mx-auto mb-2 ${action.color}`} />
                        <p className="font-medium text-slate-300">{action.label}</p>
                      </motion.a>
                    )
                  })}
                </div>
              </Card>
            </motion.div>
          </StaggerContainer>
        </main>
      </div>
    </PageTransition>
  )
}
