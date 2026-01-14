import mongoose, { Schema, type Document } from "mongoose"

interface IAdminProfile extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  email: string
  department: string
  createdAt: Date
  updatedAt: Date
}

const adminProfileSchema = new Schema<IAdminProfile>(
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
    email: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const AdminProfile = mongoose.model<IAdminProfile>("AdminProfile", adminProfileSchema)
export type { IAdminProfile }
