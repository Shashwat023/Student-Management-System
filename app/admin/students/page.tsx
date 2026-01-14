"use client"

import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/features/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

interface StudentRecord {
  id: string
  name: string
  rollNumber: string
  email: string
  course: string
}

const mockStudents: StudentRecord[] = [
  {
    id: "1",
    name: "John Doe",
    rollNumber: "CS001",
    email: "john@college.edu",
    course: "CSE",
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNumber: "CS002",
    email: "jane@college.edu",
    course: "CSE",
  },
  {
    id: "3",
    name: "Bob Johnson",
    rollNumber: "AIDS001",
    email: "bob@college.edu",
    course: "AIDS",
  },
  {
    id: "4",
    name: "Alice Brown",
    rollNumber: "AIDS002",
    email: "alice@college.edu",
    course: "AIDS",
  },
]

export default function StudentsPage() {
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
          <h1 className="text-3xl font-bold text-white">Students Management</h1>
          <p className="text-slate-400 mt-1">View and manage all students</p>
        </header>

        <main className="p-6 space-y-6">
          <Card className="p-6 bg-[#1e293b] border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-slate-500" />
              <Input placeholder="Search by name or roll number..." className="flex-1 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
          </Card>

          <Card className="p-6 bg-[#1e293b] border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-white">All Students</h2>
            <div className="rounded-lg border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-300">Name</TableHead>
                    <TableHead className="font-semibold text-slate-300">Roll Number</TableHead>
                    <TableHead className="font-semibold text-slate-300">Email</TableHead>
                    <TableHead className="font-semibold text-slate-300">Course</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-white">{student.name}</TableCell>
                      <TableCell className="font-mono text-blue-400">{student.rollNumber}</TableCell>
                      <TableCell className="text-slate-400">{student.email}</TableCell>
                      <TableCell className="text-green-400">{student.course}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
