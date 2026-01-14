import mongoose, { Schema, type Document } from "mongoose"

interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  section: string
  date: Date
  status: "present" | "absent" | "late"
  remarkedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late"],
      default: "absent",
    },
    remarkedBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminProfile",
      required: true,
    },
  },
  { timestamps: true },
)

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema)
export type { IAttendance }
