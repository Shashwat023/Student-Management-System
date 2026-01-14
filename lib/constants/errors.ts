export const ERRORS = {
  // Auth errors
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_ALREADY_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_OTP: "Invalid or expired OTP",
  EMAIL_NOT_VERIFIED: "Email not verified",
  INVALID_TOKEN: "Invalid or expired token",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",

  // Validation errors
  INVALID_EMAIL: "Invalid email format",
  WEAK_PASSWORD: "Password must be at least 8 characters",
  INVALID_COLLEGE_EMAIL: "Must use college email ID",

  // General errors
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
  BAD_REQUEST: "Bad request",
} as const
