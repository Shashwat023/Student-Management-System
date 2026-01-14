import mongoose, { Schema, type Document } from "mongoose"

interface ISubject extends Document {
  name: string
  code: string
  courseId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true },
)

export const Subject = mongoose.model<ISubject>("Subject", subjectSchema)
export type { ISubject }
