import type { Request, Response } from "express"
import { AuthService } from "../services/AuthService"
import { OAuthService } from "../services/OAuthService"
import { OAuth2Client } from "google-auth-library"
import { googleOAuthConfig } from "../config/oauth"

const authService = new AuthService()
const oauthService = new OAuthService()
const googleClient = new OAuth2Client(googleOAuthConfig.clientID)

export class AuthController {
  async registerStudent(req: Request, res: Response) {
    try {
      const { email, password, name, rollNumber, course, branch } = req.body
      const result = await authService.registerStudent(email, password, name, rollNumber, course, branch)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async registerAdmin(req: Request, res: Response) {
    try {
      const { email, password, name, department } = req.body
      const result = await authService.registerAdmin(email, password, name, department)
      res.status(201).json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const result = await authService.login(email, password)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }

  // Step 1: Verify password and send OTP
  async requestLoginOtp(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
      }

      // Import required modules
      const { User } = await import("../models/User")
      const { Otp } = await import("../models/OTP")
      const { generateOtp, hashOtp } = await import("../utils/otpUtils")
      const { EmailService } = await import("../services/EmailService")
      const bcrypt = await import("bcryptjs")

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" })
      }

      // Generate OTP
      const otp = generateOtp()
      const otpHash = hashOtp(otp)

      // Set expiry time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

      // Save OTP to database
      await Otp.create({
        userId: user._id,
        otpHash,
        type: "email",
        expiresAt,
        used: false,
      })

      // Send OTP via email
      const emailService = new EmailService()
      await emailService.sendLoginOtp(email, otp)

      res.json({
        success: true,
        message: "OTP sent to your email",
        email: email,
      })
    } catch (error: any) {
      console.error("Request Login OTP error:", error)
      res.status(500).json({ error: "Failed to send OTP" })
    }
  }

  // Step 2: Verify OTP and complete login
  async verifyLoginOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body

      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" })
      }

      // Validate OTP format (6 digits)
      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ error: "Invalid OTP format" })
      }

      // Import required modules
      const { User } = await import("../models/User")
      const { Otp } = await import("../models/OTP")
      const { verifyOtp } = await import("../utils/otpUtils")
      const { generateAccessToken, generateRefreshToken } = await import("../utils/auth/jwt")
      const { RefreshToken } = await import("../models/RefreshToken")

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        return res.status(401).json({ error: "Invalid email or OTP" })
      }

      // Find the most recent unused OTP for this user
      const otpRecord = await Otp.findOne({
        userId: user._id,
        type: "email",
        used: false,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 })

      if (!otpRecord) {
        return res.status(401).json({ error: "Invalid or expired OTP" })
      }

      // Verify OTP
      const isOtpValid = verifyOtp(otp, otpRecord.otpHash)

      if (!isOtpValid) {
        return res.status(401).json({ error: "Invalid OTP" })
      }

      // Mark OTP as used
      otpRecord.used = true
      await otpRecord.save()

      // Generate JWT tokens
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
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })

      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
      })
    } catch (error: any) {
      console.error("Verify Login OTP error:", error)
      res.status(500).json({ error: "Failed to verify OTP" })
    }
  }

  async sendOTP(req: Request, res: Response) {
    try {
      const { email } = req.body
      const result = await authService.sendOTP(email)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body
      const result = await authService.verifyOTP(email, otp)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body
      const userId = req.user?.userId

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const result = await authService.changePassword(userId, oldPassword, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body
      const result = await authService.requestPasswordReset(email)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { resetToken, newPassword } = req.body
      const result = await authService.resetPassword(resetToken, newPassword)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refreshAccessToken(refreshToken)
      res.json(result)
    } catch (error: any) {
      res.status(401).json({ error: error.message })
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const result = await authService.logout(userId)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { credential, role = "student" } = req.body

      if (!credential) {
        return res.status(400).json({ error: "Google credential is required" })
      }

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleOAuthConfig.clientID,
      })

      const payload = ticket.getPayload()
      if (!payload || !payload.email) {
        return res.status(400).json({ error: "Invalid Google token" })
      }

      // Create or find user using existing OAuthService
      const user = await oauthService.findOrCreateGoogleUser(
        {
          id: payload.sub,
          email: payload.email,
          name: payload.name || "Google User",
          picture: payload.picture,
        },
        role as "student" | "admin",
      )

      // Generate tokens using existing OAuthService
      const tokens = await oauthService.generateOAuthTokens(user._id.toString())

      res.json(tokens)
    } catch (error: any) {
      console.error("Google auth error:", error)
      res.status(400).json({ error: error.message || "Google authentication failed" })
    }
  }
}
