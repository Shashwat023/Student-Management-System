import { Attendance } from "../models/Attendance"
import { ERRORS } from "../utils/constants/errors"

export class AttendanceService {
    async markAttendance(
        studentId: string,
        subjectId: string,
        courseId: string,
        section: string,
        status: string,
        remarkedBy: string,
    ) {
        const attendance = await Attendance.create({
            studentId,
            subjectId,
            courseId,
            section,
            status,
            remarkedBy,
            date: new Date(),
        })

        return attendance
    }

    async getAttendanceByStudent(
        studentId: string,
        subjectId?: string,
        startDate?: string,
        endDate?: string,
    ) {
        const query: any = { studentId }

        if (subjectId) {
            query.subjectId = subjectId
        }

        if (startDate || endDate) {
            query.date = {}
            if (startDate) {
                query.date.$gte = new Date(startDate)
            }
            if (endDate) {
                query.date.$lte = new Date(endDate)
            }
        }

        const attendance = await Attendance.find(query)
            .populate("subjectId")
            .populate("courseId")
            .sort({ date: -1 })

        return attendance
    }

    async getAttendanceBySubject(
        subjectId: string,
        section?: string,
        startDate?: string,
        endDate?: string,
    ) {
        const query: any = { subjectId }

        if (section) {
            query.section = section
        }

        if (startDate || endDate) {
            query.date = {}
            if (startDate) {
                query.date.$gte = new Date(startDate)
            }
            if (endDate) {
                query.date.$lte = new Date(endDate)
            }
        }

        const attendance = await Attendance.find(query)
            .populate("studentId")
            .populate("courseId")
            .sort({ date: -1 })

        return attendance
    }

    async getAttendanceStats(studentId?: string, subjectId?: string) {
        const query: any = {}
        if (studentId) query.studentId = studentId
        if (subjectId) query.subjectId = subjectId

        const stats = await Attendance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ])

        const total = stats.reduce((sum, item) => sum + item.count, 0)

        return {
            total,
            breakdown: stats.reduce(
                (acc, item) => {
                    acc[item._id] = item.count
                    return acc
                },
                {} as Record<string, number>,
            ),
            percentage: {
                present: total > 0 ? Math.round(((stats.find((s) => s._id === "present")?.count || 0) / total) * 100) : 0,
                absent: total > 0 ? Math.round(((stats.find((s) => s._id === "absent")?.count || 0) / total) * 100) : 0,
                late: total > 0 ? Math.round(((stats.find((s) => s._id === "late")?.count || 0) / total) * 100) : 0,
            },
        }
    }

    async editAttendance(attendanceId: string, status: string) {
        const attendance = await Attendance.findByIdAndUpdate(attendanceId, { status }, { new: true })

        if (!attendance) {
            throw new Error(ERRORS.ATTENDANCE_NOT_FOUND)
        }

        return attendance
    }

    async deleteAttendance(attendanceId: string) {
        const attendance = await Attendance.findByIdAndDelete(attendanceId)

        if (!attendance) {
            throw new Error(ERRORS.ATTENDANCE_NOT_FOUND)
        }

        return { message: "Attendance record deleted" }
    }

    async bulkEditAttendance(updates: Array<{ attendanceId: string; status: string }>) {
        const updatePromises = updates.map((update) =>
            Attendance.findByIdAndUpdate(update.attendanceId, { status: update.status }),
        )

        await Promise.all(updatePromises)

        return { message: "Attendance records updated successfully" }
    }
}
