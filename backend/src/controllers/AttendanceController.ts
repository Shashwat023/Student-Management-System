import type { Request, Response } from "express"
import { AttendanceService } from "../services/AttendanceService"

export class AttendanceController {
  private attendanceService: AttendanceService

  constructor() {
    this.attendanceService = new AttendanceService()
  }

  async markAttendance(req: Request, res: Response) {
    try {
      const { studentId, subjectId, courseId, section, status } = req.body
      const remarkedBy = req.user?.userId

      if (!remarkedBy) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const attendance = await this.attendanceService.markAttendance(
        studentId,
        subjectId,
        courseId,
        section,
        status,
        remarkedBy,
      )

      res.status(201).json(attendance)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getAttendanceByStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params
      const { subjectId, startDate, endDate } = req.query

      const attendance = await this.attendanceService.getAttendanceByStudent(
        studentId,
        subjectId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined,
      )

      res.json(attendance)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getAttendanceBySubject(req: Request, res: Response) {
    try {
      const { subjectId } = req.params
      const { section, startDate, endDate } = req.query

      const attendance = await this.attendanceService.getAttendanceBySubject(
        subjectId,
        section as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined,
      )

      res.json(attendance)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getAttendanceStats(req: Request, res: Response) {
    try {
      const { studentId, subjectId } = req.query

      const stats = await this.attendanceService.getAttendanceStats(
        studentId as string | undefined,
        subjectId as string | undefined,
      )

      res.json(stats)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async editAttendance(req: Request, res: Response) {
    try {
      const { attendanceId } = req.params
      const { status } = req.body

      const attendance = await this.attendanceService.editAttendance(attendanceId, status)

      res.json(attendance)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async deleteAttendance(req: Request, res: Response) {
    try {
      const { attendanceId } = req.params

      const result = await this.attendanceService.deleteAttendance(attendanceId)

      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async bulkEditAttendance(req: Request, res: Response) {
    try {
      const { updates } = req.body

      const result = await this.attendanceService.bulkEditAttendance(updates)

      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
