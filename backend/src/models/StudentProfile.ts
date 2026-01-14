import mongoose, { Schema, type Document } from "mongoose"

interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  rollNumber: string
  collegeEmail: string
  course: string
  branch: string
  cgpa: number
  enrolledSubjects: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    collegeEmail: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    cgpa: {
      type: Number,
      default: 0,
    },
    enrolledSubjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  { timestamps: true },
)

export const StudentProfile = mongoose.model<IStudentProfile>("StudentProfile", studentProfileSchema)
export type { IStudentProfile }
