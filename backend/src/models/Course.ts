import mongoose, { Schema, type Document } from "mongoose"

interface ICourse extends Document {
  name: string
  code: string
  branch: string
  createdAt: Date
  updatedAt: Date
}

const courseSchema = new Schema<ICourse>(
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
    branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const Course = mongoose.model<ICourse>("Course", courseSchema)
export type { ICourse }
