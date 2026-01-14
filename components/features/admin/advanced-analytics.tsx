"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, TrendingDown } from "lucide-react"

interface TrendData {
  date: string
  attendancePercentage: number
  presentCount: number
  absentCount: number
}

interface LowAttendanceStudent {
  name: string
  rollNumber: string
  attendancePercentage: number
}

export function AdvancedAnalytics() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState<LowAttendanceStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [deptStats, setDeptStats] = useState({ avgAttendance: 0, highestAttendance: 0, lowestAttendance: 0 })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        // Mock trend data
        const mockTrends: TrendData[] = [
          { date: "2024-01-01", attendancePercentage: 78, presentCount: 65, absentCount: 18 },
          { date: "2024-01-02", attendancePercentage: 82, presentCount: 69, absentCount: 15 },
          { date: "2024-01-03", attendancePercentage: 75, presentCount: 63, absentCount: 22 },
          { date: "2024-01-04", attendancePercentage: 85, presentCount: 72, absentCount: 12 },
          { date: "2024-01-05", attendancePercentage: 80, presentCount: 67, absentCount: 17 },
        ]

        const mockLowAttendance: LowAttendanceStudent[] = [
          { name: "John Doe", rollNumber: "CS001", attendancePercentage: 45 },
          { name: "Jane Smith", rollNumber: "CS002", attendancePercentage: 52 },
          { name: "Bob Johnson", rollNumber: "CS003", attendancePercentage: 68 },
        ]

        setTrends(mockTrends)
        setLowAttendanceStudents(mockLowAttendance)
        setDeptStats({
          avgAttendance: 80,
          highestAttendance: 95,
          lowestAttendance: 45,
        })
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const handleExport = async () => {
    try {
      const response = await fetch("/api/analytics/export?courseId=default")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "attendance-export.csv"
      a.click()
    } catch (error) {
      console.error("Failed to export:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  return (
    <Tabs defaultValue="trends" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
        <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
        <TabsTrigger value="department">Department Stats</TabsTrigger>
        <TabsTrigger value="alerts">Low Attendance Alerts</TabsTrigger>
      </TabsList>

      <TabsContent value="trends">
        <Card className="p-8 bg-[#1e293b] border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">30-Day Attendance Trend</h3>
            <Button size="sm" onClick={handleExport} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #64748b" }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="attendancePercentage"
                fill="#10b981"
                stroke="#059669"
                name="Attendance %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="department">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500 shadow-lg shadow-blue-500/20">
            <p className="text-sm text-blue-200 mb-2">Average Attendance</p>
            <p className="text-4xl font-bold text-white">{deptStats.avgAttendance}%</p>
            <p className="text-xs text-blue-300 mt-2">Department-wide average</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-800 border-green-500 shadow-lg shadow-green-500/20">
            <p className="text-sm text-green-200 mb-2">Highest Attendance</p>
            <p className="text-4xl font-bold text-white">{deptStats.highestAttendance}%</p>
            <p className="text-xs text-green-300 mt-2">Best performing section</p>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-red-600 to-red-800 border-red-500 shadow-lg shadow-red-500/20">
            <p className="text-sm text-red-200 mb-2">Lowest Attendance</p>
            <p className="text-4xl font-bold text-white">{deptStats.lowestAttendance}%</p>
            <p className="text-xs text-red-300 mt-2">Needs immediate attention</p>
          </Card>
        </div>

        <Card className="p-8 bg-[#1e293b] border-slate-700 mt-6">
          <h3 className="text-lg font-bold mb-4 text-white">Trend Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #64748b" }} />
              <Legend />
              <Line type="monotone" dataKey="presentCount" stroke="#10b981" name="Present" />
              <Line type="monotone" dataKey="absentCount" stroke="#ef4444" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </TabsContent>

      <TabsContent value="alerts">
        <Card className="p-8 bg-[#1e293b] border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-bold text-white">Students with Low Attendance (&lt;75%)</h3>
          </div>

          <div className="space-y-2">
            {lowAttendanceStudents.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-red-500/30"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-slate-600">{student.rollNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">{student.attendancePercentage}%</p>
                  <p className="text-xs text-slate-500">Attendance</p>
                </div>
              </div>
            ))}
          </div>

          {lowAttendanceStudents.length === 0 && (
            <p className="text-center py-8 text-slate-500">All students maintaining good attendance</p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
