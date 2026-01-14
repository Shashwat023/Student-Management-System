import { Suspense } from "react"
import { SignupForm } from "@/components/features/auth/signup-form"

export const metadata = {
  title: "Student Sign Up | Student Management System",
  description: "Create a new student account",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Suspense>
        <SignupForm />
      </Suspense>
    </main>
  )
}
