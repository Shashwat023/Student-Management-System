import mongoose, { Schema, type Document } from "mongoose"

interface IUser extends Document {
  email: string
  password: string
  role: "student" | "admin" | "faculty"
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      default: "student",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const User = mongoose.model<IUser>("User", userSchema)
export type { IUser }
