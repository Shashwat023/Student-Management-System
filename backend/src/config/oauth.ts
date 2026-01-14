import dotenv from "dotenv"
import path from "path"

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

// Google OAuth configuration
export const googleOAuthConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectURL: process.env.GOOGLE_REDIRECT_URL || "http://localhost:3001/api/auth/google/callback",
}

// Debug: Log the Client ID being used
console.log("Google OAuth Client ID:", googleOAuthConfig.clientID)

export const validateOAuthConfig = () => {
  if (!googleOAuthConfig.clientID || !googleOAuthConfig.clientSecret) {
    console.warn("Google OAuth credentials not configured")
  }
}
