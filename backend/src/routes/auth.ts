import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { authenticateToken } from "../middleware/auth"

const router = Router()
const authController = new AuthController()

// Public routes
router.post("/register/student", (req, res) => authController.registerStudent(req, res))
router.post("/register/admin", (req, res) => authController.registerAdmin(req, res))
router.post("/login", (req, res) => authController.login(req, res))
router.post("/otp/send", (req, res) => authController.sendOTP(req, res))
router.post("/otp/verify", (req, res) => authController.verifyOTP(req, res))
router.post("/forgot-password", (req, res) => authController.requestPasswordReset(req, res))
router.post("/request-password-reset", (req, res) => authController.requestPasswordReset(req, res)) // Alias
router.post("/reset-password", (req, res) => authController.resetPassword(req, res))
router.post("/refresh-token", (req, res) => authController.refreshToken(req, res))

// Protected routes
router.post("/change-password", authenticateToken, (req, res) => authController.changePassword(req, res))
router.post("/logout", authenticateToken, (req, res) => authController.logout(req, res))

// OAuth routes
router.post("/google", (req, res) => authController.googleAuth(req, res))

export default router
