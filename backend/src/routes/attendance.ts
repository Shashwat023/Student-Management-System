import { Router } from "express"
import { AttendanceController } from "../controllers/AttendanceController"
import { authenticateToken, authorizeRole } from "../middleware/auth"

const router = Router()
const attendanceController = new AttendanceController()

// Protected routes
router.post("/mark", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  attendanceController.markAttendance(req, res),
)

router.get("/student/:studentId", authenticateToken, (req, res) =>
  attendanceController.getAttendanceByStudent(req, res),
)

router.get("/subject/:subjectId", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  attendanceController.getAttendanceBySubject(req, res),
)

router.get("/stats", authenticateToken, (req, res) => attendanceController.getAttendanceStats(req, res))

router.put("/:attendanceId", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  attendanceController.editAttendance(req, res),
)

router.delete("/:attendanceId", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  attendanceController.deleteAttendance(req, res),
)

router.post("/bulk-edit", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  attendanceController.bulkEditAttendance(req, res),
)

export default router
