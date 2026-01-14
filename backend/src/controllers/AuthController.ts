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
