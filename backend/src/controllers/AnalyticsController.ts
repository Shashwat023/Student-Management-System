import type { Request, Response } from "express"
import { AnalyticsService } from "../services/AnalyticsService"

export class AnalyticsController {
  private analyticsService: AnalyticsService

  constructor() {
    this.analyticsService = new AnalyticsService()
  }

  // Get trend analysis for attendance over time
  async getAttendanceTrends(req: Request, res: Response) {
    try {
      const { days = 30 } = req.query

      const trends = await this.analyticsService.getAttendanceTrends(Number(days))

      res.json(trends)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get departmental statistics
  async getDepartmentStats(req: Request, res: Response) {
    try {
      const { department } = req.query

      const stats = await this.analyticsService.getDepartmentStats(department as string | undefined)

      res.json(stats)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get students with low attendance (below threshold)
  async getLowAttendanceStudents(req: Request, res: Response) {
    try {
      const { threshold = 75 } = req.query

      const lowAttendanceStudents = await this.analyticsService.getLowAttendanceStudents(Number(threshold))

      res.json(lowAttendanceStudents)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Export attendance data as CSV
  async exportAttendanceData(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query

      const records = await this.analyticsService.exportAttendanceData(
        startDate as string | undefined,
        endDate as string | undefined,
      )

      // Convert to CSV format
      const csvHeader = "Date,Student Name,Roll Number,Subject,Status\n"
      const csvRows = records
        .map(
          (record: any) =>
            `${record.date.toISOString().split("T")[0]},${record.studentId.name},${record.studentId.rollNumber},${record.subjectId.name},${record.status}`,
        )
        .join("\n")

      const csv = csvHeader + csvRows

      res.setHeader("Content-Type", "text/csv")
      res.setHeader("Content-Disposition", 'attachment; filename="attendance-export.csv"')
      res.send(csv)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Record daily analytics snapshot
  async recordDailyAnalytics(req: Request, res: Response) {
    try {
      const result = await this.analyticsService.recordDailySnapshot()

      res.status(201).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
