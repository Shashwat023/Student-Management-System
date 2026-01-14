import { connectDB } from "../config/database"
import { Course } from "../models/Course"
import { Subject } from "../models/Subject"
import { User } from "../models/User"
import { hashPassword } from "../utils/auth/password"

async function setupDatabase() {
  try {
    await connectDB()

    // Create default admin user if not exists
    const existingAdmin = await User.findOne({ email: "admin@college.edu" })
    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123")
      await User.create({
        email: "admin@college.edu",
        password: hashedPassword,
        role: "admin",
      })
      console.log("Created default admin user: admin@college.edu / admin123")
    }

    // Create sample courses
    const courseData = [
      { name: "Computer Science", code: "CS", branch: "CSE" },
      { name: "Artificial Intelligence", code: "AI", branch: "AIDS" },
      { name: "Information Technology", code: "IT", branch: "IT" },
    ]

    for (const course of courseData) {
      const existing = await Course.findOne({ code: course.code })
      if (!existing) {
        await Course.create(course)
        console.log(`Created course: ${course.name}`)
      }
    }

    // Create sample subjects
    const courses = await Course.find()

    const subjectData = [
      { name: "Data Structures", code: "DS101", courseId: courses[0]?._id },
      { name: "Database Management Systems", code: "DBMS101", courseId: courses[0]?._id },
      { name: "Machine Learning", code: "ML201", courseId: courses[1]?._id },
      { name: "Deep Learning", code: "DL201", courseId: courses[1]?._id },
      { name: "Web Development", code: "WD101", courseId: courses[2]?._id },
    ]

    for (const subject of subjectData) {
      const existing = await Subject.findOne({ code: subject.code })
      if (!existing && subject.courseId) {
        await Subject.create(subject)
        console.log(`Created subject: ${subject.name}`)
      }
    }

    console.log("Database setup complete!")
    process.exit(0)
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
