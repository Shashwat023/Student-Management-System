import mongoose, { Schema, type Document } from "mongoose"

interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PasswordReset = mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema)
export type { IPasswordReset }
