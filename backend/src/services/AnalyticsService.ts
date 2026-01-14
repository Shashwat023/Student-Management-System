import { Attendance } from "../models/Attendance"
import { Analytics } from "../models/Analytics"
import { StudentProfile } from "../models/StudentProfile"

export class AnalyticsService {
    async getAttendanceTrends(days: number = 30) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const trends = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" },
                    },
                    present: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                    absent: {
                        $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
                    },
                    late: {
                        $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
                    },
                    total: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ])

        return trends
    }

    async getDepartmentStats(department?: string) {
        const query: any = {}
        if (department) query.department = department

        const stats = await StudentProfile.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "attendances",
                    localField: "userId",
                    foreignField: "studentId",
                    as: "attendance",
                },
            },
            {
                $group: {
                    _id: "$branch",
                    totalStudents: { $sum: 1 },
                    avgAttendance: {
                        $avg: {
                            $cond: [
                                { $gt: [{ $size: "$attendance" }, 0] },
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $size: {
                                                        $filter: {
                                                            input: "$attendance",
                                                            cond: { $eq: ["$$this.status", "present"] },
                                                        },
                                                    },
                                                },
                                                { $size: "$attendance" },
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                    },
                },
            },
        ])

        return stats
    }

    async getLowAttendanceStudents(threshold: number = 75) {
        const students = await StudentProfile.find().populate("userId")

        const studentsWithAttendance = await Promise.all(
            students.map(async (student) => {
                const attendance = await Attendance.find({ studentId: student.userId })
                const total = attendance.length
                const present = attendance.filter((a) => a.status === "present").length
                const percentage = total > 0 ? (present / total) * 100 : 0

                return {
                    student,
                    attendancePercentage: percentage,
                    totalClasses: total,
                    presentClasses: present,
                }
            }),
        )

        return studentsWithAttendance.filter((s) => s.attendancePercentage < threshold)
    }

    async recordDailySnapshot() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const stats = await Attendance.aggregate([
            {
                $match: {
                    date: { $gte: today },
                },
            },
            {
                $group: {
                    _id: null,
                    present: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                    absent: {
                        $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
                    },
                    late: {
                        $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
                    },
                    total: { $sum: 1 },
                },
            },
        ])

        const snapshot = stats[0] || { present: 0, absent: 0, late: 0, total: 0 }

        await Analytics.create({
            date: today,
            totalPresent: snapshot.present,
            totalAbsent: snapshot.absent,
            totalLate: snapshot.late,
            totalClasses: snapshot.total,
            attendancePercentage: snapshot.total > 0 ? (snapshot.present / snapshot.total) * 100 : 0,
        })

        return { message: "Daily snapshot recorded successfully" }
    }

    async exportAttendanceData(startDate?: string, endDate?: string) {
        const query: any = {}

        if (startDate || endDate) {
            query.date = {}
            if (startDate) query.date.$gte = new Date(startDate)
            if (endDate) query.date.$lte = new Date(endDate)
        }

        const attendance = await Attendance.find(query)
            .populate("studentId")
            .populate("subjectId")
            .populate("courseId")
            .sort({ date: -1 })

        return attendance
    }
}
