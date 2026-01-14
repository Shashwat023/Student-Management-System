import mongoose, { Schema, type Document } from "mongoose"

interface IOTPVerification extends Document {
  email: string
  otp: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
}

const otpVerificationSchema = new Schema<IOTPVerification>(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
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

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const OTPVerification = mongoose.model<IOTPVerification>("OTPVerification", otpVerificationSchema)
export type { IOTPVerification }
