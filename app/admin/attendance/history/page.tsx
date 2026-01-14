"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminSidebar } from "@/components/features/admin/sidebar"
import { AttendanceEditModal } from "@/components/features/admin/attendance-edit-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Trash2, Search } from "lucide-react"

interface AttendanceHistoryRecord {
  id: string
  date: string
  studentName: string
  rollNumber: string
  subject: string
  section: string
  status: "present" | "absent" | "late"
}

const mockHistory: AttendanceHistoryRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    studentName: "John Doe",
    rollNumber: "CS001",
    subject: "Data Structures",
    section: "A",
    status: "present",
  },
  {
    id: "2",
    date: "2024-01-15",
    studentName: "Jane Smith",
    rollNumber: "CS002",
    subject: "Data Structures",
    section: "A",
    status: "absent",
  },
  {
    id: "3",
    date: "2024-01-15",
    studentName: "Bob Johnson",
    rollNumber: "AIDS001",
    subject: "Machine Learning",
    section: "B",
    status: "late",
  },
  {
    id: "4",
    date: "2024-01-14",
    studentName: "Alice Brown",
    rollNumber: "AIDS002",
    subject: "Machine Learning",
    section: "B",
    status: "present",
  },
]

export default function AttendanceHistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<AttendanceHistoryRecord[]>(mockHistory)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<"present" | "absent" | "late">("present")
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const filteredHistory = history.filter(
    (record) =>
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditClick = (id: string, currentStatus: "present" | "absent" | "late") => {
    setEditingId(id)
    setEditingStatus(currentStatus)
  }

  const handleSaveEdit = async (newStatus: "present" | "absent" | "late") => {
    setHistory((prev) => prev.map((record) => (record.id === editingId ? { ...record, status: newStatus } : record)))
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((record) => record.id !== id))
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-3xl font-bold text-slate-900">Attendance History</h1>
          <p className="text-slate-600 mt-1">View and manage all attendance records</p>
        </header>

        <main className="p-6 space-y-6">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by student name, roll number, or subject..."
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Attendance Records</h2>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold">Roll Number</TableHead>
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold">Section</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell className="font-mono text-sm">{record.rollNumber}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell className="text-center">{record.section}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : record.status === "absent"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(record.id, record.status)}>
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(record.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <AttendanceEditModal
            open={editingId !== null}
            onOpenChange={(open) => !open && setEditingId(null)}
            attendanceId={editingId || ""}
            currentStatus={editingStatus}
            onSave={handleSaveEdit}
          />
        </main>
      </div>
    </div>
  )
}
