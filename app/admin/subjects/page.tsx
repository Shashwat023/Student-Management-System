"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AdminSidebar } from "@/components/features/admin/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface Subject {
  id: string
  name: string
  code: string
  course: string
}

const mockSubjects: Subject[] = [
  { id: "1", name: "Data Structures", code: "DS101", course: "CSE" },
  { id: "2", name: "Database Management Systems", code: "DBMS101", course: "CSE" },
  { id: "3", name: "Machine Learning", code: "ML201", course: "AIDS" },
  { id: "4", name: "Artificial Intelligence", code: "AI201", course: "AIDS" },
]

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const [newSubject, setNewSubject] = useState({ name: "", code: "", course: "" })

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code && newSubject.course) {
      setSubjects([...subjects, { id: Date.now().toString(), ...newSubject }])
      setNewSubject({ name: "", code: "", course: "" })
    }
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 overflow-auto">
        <header className="bg-[#1e293b] border-b border-slate-700 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">Subjects Management</h1>
          <p className="text-slate-400 mt-1">Add and manage subjects</p>
        </header>

        <main className="p-6 space-y-6">
          <Card className="p-6 bg-[#1e293b] border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Subject</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Subject Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Data Structures"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-300">Subject Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., DS101"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course" className="text-slate-300">Course</Label>
                <Input
                  id="course"
                  placeholder="e.g., CSE"
                  value={newSubject.course}
                  onChange={(e) => setNewSubject({ ...newSubject, course: e.target.value })}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>

              <Button onClick={handleAddSubject} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-[#1e293b] border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-white">All Subjects</h2>
            <div className="rounded-lg border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-300">Subject Name</TableHead>
                    <TableHead className="font-semibold text-slate-300">Code</TableHead>
                    <TableHead className="font-semibold text-slate-300">Course</TableHead>
                    <TableHead className="font-semibold text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium text-white">{subject.name}</TableCell>
                      <TableCell className="font-mono text-blue-400">{subject.code}</TableCell>
                      <TableCell className="text-green-400">{subject.course}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteSubject(subject.id)}>
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
        </main>
      </div>
    </div>
  )
}
