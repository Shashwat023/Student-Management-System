"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, BookOpen, Clock, Settings, LogOut, TrendingUp } from "lucide-react"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    name: "Students",
    href: "/admin/students",
    icon: Users,
  },
  {
    name: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    name: "Attendance",
    href: "/admin/attendance",
    icon: Clock,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  onLogout: () => void
}

export function AdminSidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      className="w-64 bg-[#1e293b] border-r border-slate-700 h-screen flex flex-col"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="p-6 border-b border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white">Admin Portal</h2>
        <p className="text-sm text-slate-400">Management System</p>
      </motion.div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link href={item.href}>
                <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-orange-600 hover:bg-orange-700", !isActive && "text-slate-300 hover:bg-slate-700")}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <motion.div
        className="p-4 border-t border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="w-full justify-start bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700" onClick={onLogout}>
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </motion.div>
      </motion.div>
    </motion.aside>
  )
}
