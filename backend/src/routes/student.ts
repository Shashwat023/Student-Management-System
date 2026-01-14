import { Router } from "express"
import { StudentController } from "../controllers/StudentController"
import { authenticateToken, authorizeRole } from "../middleware/auth"

const router = Router()
const studentController = new StudentController()

// Get student profile (student or admin)
router.get("/profile", authenticateToken, (req, res) => studentController.getProfile(req, res))

// Get specific student profile by ID (admin only)
router.get("/:userId", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
    studentController.getProfile(req, res),
)

// Update student profile (student updates own profile)
router.put("/profile", authenticateToken, authorizeRole("student"), (req, res) =>
    studentController.updateProfile(req, res),
)

// Get all students with optional filters (admin/faculty only)
router.get("/", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
    studentController.getAllStudents(req, res),
)

// Delete student (admin only)
router.delete("/:userId", authenticateToken, authorizeRole("admin"), (req, res) =>
    studentController.deleteStudent(req, res),
)

export default router
