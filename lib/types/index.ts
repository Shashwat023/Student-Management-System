export type UserRole = "student" | "admin" | "faculty"

export interface User {
  _id: string
  email: string
  password: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudentProfile {
  _id: string
  userId: string
  name: string
  rollNumber: string
  collegeEmail: string
  course: string
  branch: string
  cgpa: number
  enrolledSubjects: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AdminProfile {
  _id: string
  userId: string
  name: string
  email: string
  department: string
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  _id: string
  name: string
  code: string
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  _id: string
  name: string
  code: string
  branch: string
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  _id: string
  studentId: string
  subjectId: string
  courseId: string
  section: string
  date: Date
  status: "present" | "absent" | "late"
  remarkedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface OTPVerification {
  _id: string
  email: string
  otp: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
}

export interface RefreshToken {
  _id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
}
