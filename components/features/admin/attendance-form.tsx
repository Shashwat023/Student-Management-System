"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, CheckCircle2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Student {
  id: string
  name: string
  rollNumber: string
}

interface Subject {
  id: string
  name: string
  code: string
}

interface AttendanceRecord {
  studentId: string
  status: "present" | "absent" | "late"
}

export function AttendanceForm() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(true)

  useEffect(() => {
    loadStudents()
    loadSubjects()
  }, [])

  const loadStudents = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockStudents: Student[] = [
        { id: "1", name: "John Doe", rollNumber: "CS001" },
        { id: "2", name: "Jane Smith", rollNumber: "CS002" },
        { id: "3", name: "Bob Johnson", rollNumber: "CS003" },
        { id: "4", name: "Alice Brown", rollNumber: "CS004" },
      ]
      setStudents(mockStudents)
      setAttendanceRecords(mockStudents.map((student) => ({ studentId: student.id, status: "absent" })))
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const loadSubjects = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockSubjects: Subject[] = [
        { id: "1", name: "Data Structures", code: "DS101" },
        { id: "2", name: "Database Management Systems", code: "DBMS101" },
        { id: "3", name: "Machine Learning", code: "ML201" },
      ]
      setSubjects(mockSubjects)
    } catch (error) {
      console.error("Failed to load subjects:", error)
    }
  }

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.studentId === studentId ? { ...record, status } : record)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubject) return

    setLoading(true)

    try {
      await apiClient.attendance.markAttendance({
        subjectId: selectedSubject,
        date: new Date().toISOString().split('T')[0],
        attendance: attendanceRecords,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to mark attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-[#1e293b] border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Mark Attendance</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-slate-300">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject" disabled={loading}>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section" className="text-slate-300">Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger id="section" disabled={loading}>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Section A (CSE)</SelectItem>
                <SelectItem value="b">Section B (AIDS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <p className="text-green-300 font-medium">Attendance marked successfully</p>
          </div>
        )}

        {loadingStudents ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-800/50">
            <Table>
              <TableHeader className="bg-slate-800">
                <TableRow>
                  <TableHead className="font-semibold text-slate-300">Roll Number</TableHead>
                  <TableHead className="font-semibold text-slate-300">Student Name</TableHead>
                  <TableHead className="font-semibold text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const record = attendanceRecords.find((r) => r.studentId === student.id)

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm text-blue-400">{student.rollNumber}</TableCell>
                      <TableCell className="text-white">{student.name}</TableCell>
                      <TableCell>
                        <Select
                          value={record?.status || "absent"}
                          onValueChange={(value: "present" | "absent" | "late") => handleAttendanceChange(student.id, value)}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <Button type="submit" disabled={loading || !selectedSubject || !selectedSection} className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Attendance...
            </>
          ) : (
            "Mark Attendance"
          )}
        </Button>
      </form>
    </Card>
  )
}
