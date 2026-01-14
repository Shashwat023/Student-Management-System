import { User } from "../models/User"
import { StudentProfile } from "../models/StudentProfile"
import { AdminProfile } from "../models/AdminProfile"
import { generateAccessToken, generateRefreshToken } from "../utils/auth/jwt"
import { RefreshToken } from "../models/RefreshToken"

interface GoogleProfile {
  id: string
  email: string
  name: string
  picture?: string
}

export class OAuthService {
  async findOrCreateGoogleUser(profile: GoogleProfile, role: "student" | "admin" = "student") {
    let user = await User.findOne({ email: profile.email })

    if (!user) {
      user = await User.create({
        email: profile.email,
        password: "", // OAuth users don't have passwords
        role,
        isEmailVerified: true,
      })

      if (role === "student") {
        await StudentProfile.create({
          userId: user._id,
          name: profile.name,
          rollNumber: `OAUTH_${Date.now()}`,
          collegeEmail: profile.email,
          course: "Pending",
          branch: "Pending",
          cgpa: 0,
        })
      } else if (role === "admin") {
        await AdminProfile.create({
          userId: user._id,
          name: profile.name,
          email: profile.email,
          department: "Pending",
        })
      }
    }

    return user
  }

  async generateOAuthTokens(userId: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error("User not found")
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

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return { accessToken, refreshToken, user }
  }
}
