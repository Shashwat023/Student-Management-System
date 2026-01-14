import dotenv from "dotenv"
import { connectDB, disconnectDB } from "../config/database"
import { User } from "../models/User"
import { hashPassword } from "../utils/auth/password"

dotenv.config()

const createAdmin = async () => {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@college.edu" })
    if (existingAdmin) {
      console.log("Admin user already exists")
    } else {
      // Create admin user
      const hashedPassword = await hashPassword("admin123")
      await User.create({
        email: "admin@college.edu",
        password: hashedPassword,
        role: "admin",
      })
      console.log("✅ Admin user created successfully!")
      console.log("📧 Email: admin@college.edu")
      console.log("🔑 Password: admin123")
    }

    await disconnectDB()
  } catch (error) {
    console.error("Error creating admin:", error)
    await disconnectDB()
    process.exit(1)
  }
}

createAdmin()
