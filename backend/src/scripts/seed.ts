import dotenv from "dotenv"
import { connectDB, disconnectDB } from "../config/database"
import { Course } from "../models/Course"
import { Subject } from "../models/Subject"

dotenv.config()

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing data
    await Course.deleteMany({})
    await Subject.deleteMany({})

    // Seed courses
    const cseCourse = await Course.create({
      name: "Computer Science Engineering",
      code: "CSE",
      branch: "Engineering",
    })

    const aidsCourse = await Course.create({
      name: "Artificial Intelligence & Data Science",
      code: "AIDS",
      branch: "Engineering",
    })

    // Seed subjects
    const subjects = [
      {
        name: "Data Structures",
        code: "DS101",
        courseId: cseCourse._id,
      },
      {
        name: "Database Management Systems",
        code: "DBMS101",
        courseId: cseCourse._id,
      },
      {
        name: "Machine Learning",
        code: "ML201",
        courseId: aidsCourse._id,
      },
      {
        name: "Artificial Intelligence",
        code: "AI201",
        courseId: aidsCourse._id,
      },
    ]

    await Subject.insertMany(subjects)

    console.log("Database seeded successfully")
    await disconnectDB()
  } catch (error) {
    console.error("Seeding error:", error)
    await disconnectDB()
    process.exit(1)
  }
}

seedDatabase()
