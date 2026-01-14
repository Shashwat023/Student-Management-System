import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"
import { ERRORS } from "../utils/constants/errors"

export class StudentService {
    async getStudentProfile(userId: string) {
        const profile = await StudentProfile.findOne({ userId }).populate("userId")

        if (!profile) {
            throw new Error(ERRORS.USER_NOT_FOUND || "Student profile not found")
        }

        return profile
    }

    async updateStudentProfile(
        userId: string,
        updates: {
            name?: string
            rollNumber?: string
            course?: string
            branch?: string
            semester?: number
            cgpa?: number
            phoneNumber?: string
        },
    ) {
        const profile = await StudentProfile.findOneAndUpdate({ userId }, updates, { new: true })

        if (!profile) {
            throw new Error(ERRORS.USER_NOT_FOUND || "Student profile not found")
        }

        return profile
    }

    async getAllStudents(filters?: { course?: string; branch?: string; semester?: number }) {
        const query: any = {}

        if (filters?.course) query.course = filters.course
        if (filters?.branch) query.branch = filters.branch
        if (filters?.semester) query.semester = filters.semester

        const students = await StudentProfile.find(query).populate("userId")

        return students
    }

    async deleteStudent(userId: string) {
        const profile = await StudentProfile.findOneAndDelete({ userId })

        if (!profile) {
            throw new Error(ERRORS.USER_NOT_FOUND || "Student profile not found")
        }

        // Also delete the user account
        await User.findByIdAndDelete(userId)

        return { message: "Student deleted successfully" }
    }
}
