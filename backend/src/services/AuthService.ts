import { User } from "../models/User"
import { StudentProfile } from "../models/StudentProfile"
import { AdminProfile } from "../models/AdminProfile"
import { OTPVerification } from "../models/OTPVerification"
import { RefreshToken } from "../models/RefreshToken"
import { PasswordReset } from "../models/PasswordReset"
import { EmailService } from "./EmailService"
import { hashPassword, verifyPassword } from "../utils/auth/password"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth/jwt"
import { generateOTP, isOTPExpired } from "../utils/auth/otp"
import crypto from "crypto"
import { ERRORS } from "../utils/constants/errors"

export class AuthService {
  private emailService: EmailService

  constructor() {
    this.emailService = new EmailService()
  }

  async registerStudent(
    email: string,
    password: string,
    name: string,
    rollNumber: string,
    course: string,
    branch: string,
  ) {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error(ERRORS.USER_ALREADY_EXISTS)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "student",
    })

    // Create student profile
    await StudentProfile.create({
      userId: user._id,
      name,
      rollNumber,
      collegeEmail: email,
      course,
      branch,
      cgpa: 0,
    })

    return { userId: user._id, email: user.email }
  }

  async registerAdmin(email: string, password: string, name: string, department: string) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error(ERRORS.USER_ALREADY_EXISTS)
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    })

    await AdminProfile.create({
      userId: user._id,
      name,
      email,
      department,
    })

    return { userId: user._id, email: user.email }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error(ERRORS.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      throw new Error(ERRORS.INVALID_CREDENTIALS)
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Save refresh token to database
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    }
  }

  async sendOTP(email: string) {
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await OTPVerification.create({
      email,
      otp,
      expiresAt,
    })

    try {
      await this.emailService.sendOTPEmail(email, otp)
    } catch (error) {
      console.error("Failed to send OTP email:", error)
      // Still return success but log the error
    }

    return { message: "OTP sent successfully" }
  }

  async verifyOTP(email: string, otp: string) {
    const otpRecord = await OTPVerification.findOne({ email, otp })

    if (!otpRecord) {
      throw new Error(ERRORS.INVALID_OTP)
    }

    if (isOTPExpired(otpRecord.createdAt)) {
      throw new Error(ERRORS.INVALID_OTP)
    }

    await OTPVerification.updateOne({ _id: otpRecord._id }, { isUsed: true })

    return { verified: true }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error(ERRORS.USER_NOT_FOUND)
    }

    const isPasswordValid = await verifyPassword(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new Error(ERRORS.INVALID_CREDENTIALS)
    }

    const hashedPassword = await hashPassword(newPassword)
    await User.updateOne({ _id: userId }, { password: hashedPassword })

    // Get user profile for name
    let userName = user.email
    if (user.role === "student") {
      const profile = await StudentProfile.findOne({ userId: user._id })
      if (profile) userName = profile.name
    } else if (user.role === "admin") {
      const profile = await AdminProfile.findOne({ userId: user._id })
      if (profile) userName = profile.name
    }

    // Send confirmation email
    try {
      await this.emailService.sendPasswordChangedEmail(user.email, userName)
    } catch (error) {
      console.error("Failed to send password changed email:", error)
    }

    return { message: "Password changed successfully" }
  }

  async requestPasswordReset(email: string) {
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists for security
      return { message: "If user exists, password reset email will be sent" }
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    })

    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken)
    } catch (error) {
      console.error("Failed to send password reset email:", error)
    }

    return { message: "If user exists, password reset email will be sent" }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    })

    if (!resetRecord) {
      throw new Error(ERRORS.INVALID_TOKEN)
    }

    const user = await User.findById(resetRecord.userId)
    if (!user) {
      throw new Error(ERRORS.USER_NOT_FOUND)
    }

    const hashedPassword = await hashPassword(newPassword)
    await User.updateOne({ _id: resetRecord.userId }, { password: hashedPassword })
    await PasswordReset.updateOne({ _id: resetRecord._id }, { isUsed: true })

    // Get user profile for name
    let userName = user.email
    if (user.role === "student") {
      const profile = await StudentProfile.findOne({ userId: user._id })
      if (profile) userName = profile.name
    } else if (user.role === "admin") {
      const profile = await AdminProfile.findOne({ userId: user._id })
      if (profile) userName = profile.name
    }

    // Send confirmation email
    try {
      await this.emailService.sendPasswordChangedEmail(user.email, userName)
    } catch (error) {
      console.error("Failed to send password changed email:", error)
    }

    return { message: "Password reset successfully" }
  }

  async refreshAccessToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken)
    if (!payload || typeof payload === 'string') {
      throw new Error(ERRORS.INVALID_TOKEN)
    }

    const user = await User.findById(payload.userId)
    if (!user) {
      throw new Error(ERRORS.USER_NOT_FOUND)
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return { accessToken: newAccessToken }
  }

  async logout(userId: string) {
    await RefreshToken.deleteMany({ userId })
    return { message: "Logged out successfully" }
  }
}
