import { Router } from "express"
import { AnalyticsController } from "../controllers/AnalyticsController"
import { authenticateToken, authorizeRole } from "../middleware/auth"

const router = Router()
const analyticsController = new AnalyticsController()

// Protected routes
router.get("/trends", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  analyticsController.getAttendanceTrends(req, res),
)

router.get("/department-stats", authenticateToken, authorizeRole("admin"), (req, res) =>
  analyticsController.getDepartmentStats(req, res),
)

router.get("/low-attendance", authenticateToken, authorizeRole("admin"), (req, res) =>
  analyticsController.getLowAttendanceStudents(req, res),
)

router.get("/export", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  analyticsController.exportAttendanceData(req, res),
)

router.post("/record-daily", authenticateToken, authorizeRole("admin", "faculty"), (req, res) =>
  analyticsController.recordDailyAnalytics(req, res),
)

export default router
