import express, { type Express } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database"
import authRoutes from "./routes/auth"
import attendanceRoutes from "./routes/attendance"
import analyticsRoutes from "./routes/analytics"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Connect to database
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error", message: err.message })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
