import crypto from "crypto"

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP string
 */
export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash OTP using SHA-256
 * @param {string} otp - Plain OTP to hash
 * @returns {string} Hashed OTP
 */
export const hashOtp = (otp: string): string => {
    return crypto.createHash("sha256").update(otp).digest("hex")
}

/**
 * Verify OTP against hash
 * @param {string} plainOtp - Plain OTP entered by user
 * @param {string} hashedOtp - Hashed OTP from database
 * @returns {boolean} True if OTP matches, false otherwise
 */
export const verifyOtp = (plainOtp: string, hashedOtp: string): boolean => {
    const hashedInput = hashOtp(plainOtp)
    return hashedInput === hashedOtp
}
