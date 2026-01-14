import mongoose, { Schema, type Document } from "mongoose"

interface IAnalytics extends Document {
  courseId: mongoose.Types.ObjectId
  sectionId: string
  date: Date
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendancePercentage: number
  createdAt: Date
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalStudents: {
      type: Number,
      required: true,
    },
    presentCount: {
      type: Number,
      default: 0,
    },
    absentCount: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

export const Analytics = mongoose.model<IAnalytics>("Analytics", analyticsSchema)
export type { IAnalytics }
