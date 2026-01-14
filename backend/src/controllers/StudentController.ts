import type { Request, Response } from "express"
import { StudentService } from "../services/StudentService"

export class StudentController {
    private studentService: StudentService

    constructor() {
        this.studentService = new StudentService()
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.userId || req.params.userId

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" })
            }

            const profile = await this.studentService.getStudentProfile(userId)

            res.json(profile)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.userId

            if (!userId) {
                return res.status(401).json({ error: "Unauthorized" })
            }

            const updates = req.body
            const profile = await this.studentService.updateStudentProfile(userId, updates)

            res.json(profile)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async getAllStudents(req: Request, res: Response) {
        try {
            const { course, branch, semester } = req.query

            const filters = {
                course: course as string | undefined,
                branch: branch as string | undefined,
                semester: semester ? Number(semester) : undefined,
            }

            const students = await this.studentService.getAllStudents(filters)

            res.json(students)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async deleteStudent(req: Request, res: Response) {
        try {
            const { userId } = req.params

            const result = await this.studentService.deleteStudent(userId)

            res.json(result)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }
}
