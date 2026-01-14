import { Suspense } from "react"
import { LoginForm } from "@/components/features/auth/login-form"

export const metadata = {
  title: "Student Login | Student Management System",
  description: "Login to your student account",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
