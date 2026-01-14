import mongoose, { Schema, Document } from "mongoose"

export interface IOtp extends Document {
    userId: mongoose.Types.ObjectId
    otpHash: string
    type: "email" | "phone"
    expiresAt: Date
    used: boolean
    createdAt: Date
    updatedAt: Date
}

const OtpSchema = new Schema<IOtp>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        otpHash: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["email", "phone"],
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

// TTL index: Auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Additional indexes for faster queries
OtpSchema.index({ userId: 1, used: 1 })
OtpSchema.index({ userId: 1, type: 1 })

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema)
