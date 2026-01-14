"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const attendanceData = [
  {
    subject: "Data Structures",
    present: 85,
    absent: 10,
    late: 5,
  },
  {
    subject: "DBMS",
    present: 78,
    absent: 15,
    late: 7,
  },
  {
    subject: "Machine Learning",
    present: 90,
    absent: 7,
    late: 3,
  },
]

export function AttendanceAnalytics() {
  return (
    <Card className="p-8 bg-[#1e293b] border-slate-700">
      <h2 className="text-xl font-bold mb-6 text-white">Attendance Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={attendanceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #64748b" }} />
          <Legend />
          <Bar dataKey="present" fill="#10b981" />
          <Bar dataKey="absent" fill="#ef4444" />
          <Bar dataKey="late" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
