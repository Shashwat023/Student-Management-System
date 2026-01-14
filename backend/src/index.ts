import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database"
import authRoutes from "./routes/auth"
import attendanceRoutes from "./routes/attendance"
import analyticsRoutes from "./routes/analytics"
import studentRoutes from "./routes/student"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/students", studentRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Database connection and server start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
