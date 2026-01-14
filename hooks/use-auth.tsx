"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  email: string
  name?: string
  role: "student" | "admin" | "faculty"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: StudentSignupData) => Promise<void>
  logout: () => Promise<void>
  sendOTP: (email: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  error: string | null
}

interface StudentSignupData {
  email: string
  password: string
  name: string
  rollNumber: string
  course: string
  branch: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken")
      const userId = localStorage.getItem("userId")
      const email = localStorage.getItem("email")
      const role = localStorage.getItem("role")

      if (token && userId && email && role) {
        setUser({
          id: userId,
          email,
          role: role as "student" | "admin" | "faculty",
        })
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      const response = await apiClient.auth.login(email, password)

      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)
      localStorage.setItem("userId", response.user.id)
      localStorage.setItem("email", response.user.email)
      localStorage.setItem("role", response.user.role)

      setUser(response.user)
    } catch (err: any) {
      const errorMsg = err.message || "Login failed"
      setError(errorMsg)
      throw err
    }
  }, [])

  const signup = useCallback(async (data: StudentSignupData) => {
    try {
      setError(null)
      const response = await apiClient.auth.registerStudent(data)

      // After signup, auto-login
      const loginResponse = await apiClient.auth.login(data.email, data.password)

      localStorage.setItem("accessToken", loginResponse.accessToken)
      localStorage.setItem("refreshToken", loginResponse.refreshToken)
      localStorage.setItem("userId", loginResponse.user.id)
      localStorage.setItem("email", loginResponse.user.email)
      localStorage.setItem("role", loginResponse.user.role)

      setUser(loginResponse.user)
    } catch (err: any) {
      const errorMsg = err.message || "Signup failed"
      setError(errorMsg)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.auth.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("email")
      localStorage.removeItem("role")
      setUser(null)
    }
  }, [])

  const sendOTP = useCallback(async (email: string) => {
    try {
      setError(null)
      await apiClient.auth.sendOTP(email)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
      throw err
    }
  }, [])

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      setError(null)
      await apiClient.auth.verifyOTP(email, otp)
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
      throw err
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        sendOTP,
        verifyOTP,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
