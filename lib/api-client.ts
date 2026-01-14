// Frontend API client for authentication
export const apiClient = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",

  request: async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const token = localStorage.getItem("accessToken")

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${apiClient.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Don't try to refresh token for auth endpoints (login, register, etc.)
      const isAuthEndpoint = endpoint.includes('/api/auth/login') ||
        endpoint.includes('/api/auth/register') ||
        endpoint.includes('/api/auth/google') ||
        endpoint.includes('/api/auth/otp') ||
        endpoint.includes('/api/auth/refresh-token') ||
        endpoint.includes('/api/auth/request-password-reset') ||
        endpoint.includes('/api/auth/reset-password')

      if (response.status === 401 && !isAuthEndpoint) {
        // Try to refresh token only for non-auth endpoints
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${apiClient.baseURL}/api/auth/refresh-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            })

            if (refreshResponse.ok) {
              const data = await refreshResponse.json()
              localStorage.setItem("accessToken", data.accessToken)
              // Retry original request
              return apiClient.request(endpoint, options)
            }
          } catch (error) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            window.location.href = "/auth/login"
          }
        }
      }

      // Parse error message from response
      const errorData = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(errorData.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  },

  // Auth endpoints
  auth: {
    registerStudent: (data: any) =>
      apiClient.request("/api/auth/register/student", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    registerAdmin: (data: any) =>
      apiClient.request("/api/auth/register/admin", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (email: string, password: string) =>
      apiClient.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    sendOTP: (email: string) =>
      apiClient.request("/api/auth/otp/send", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    verifyOTP: (email: string, otp: string) =>
      apiClient.request("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }),

    requestPasswordReset: (email: string) =>
      apiClient.request("/api/auth/request-password-reset", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    resetPassword: (resetToken: string, newPassword: string) =>
      apiClient.request("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ resetToken, newPassword }),
      }),

    changePassword: (oldPassword: string, newPassword: string) =>
      apiClient.request("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
      }),

    logout: () =>
      apiClient.request("/api/auth/logout", {
        method: "POST",
      }),

    refreshToken: (refreshToken: string) =>
      apiClient.request("/api/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),

    googleAuth: (credential: string, role: "student" | "admin" = "student") =>
      apiClient.request("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential, role }),
      }),

    // 2-Step OTP Login
    requestLoginOtp: (email: string, password: string) =>
      apiClient.request("/api/auth/login/request-otp", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    verifyLoginOtp: (email: string, otp: string) =>
      apiClient.request("/api/auth/login/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      }),
  },

  // Attendance endpoints
  attendance: {
    markAttendance: (data: any) =>
      apiClient.request("/api/attendance/mark", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getStudentAttendance: (studentId: string) =>
      apiClient.request(`/api/attendance/student/${studentId}`),

    getSubjectAttendance: (subjectId: string) =>
      apiClient.request(`/api/attendance/subject/${subjectId}`),

    getAttendanceStats: () =>
      apiClient.request("/api/attendance/stats"),

    editAttendance: (attendanceId: string, data: any) =>
      apiClient.request(`/api/attendance/${attendanceId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    deleteAttendance: (attendanceId: string) =>
      apiClient.request(`/api/attendance/${attendanceId}`, {
        method: "DELETE",
      }),

    bulkEditAttendance: (data: any) =>
      apiClient.request("/api/attendance/bulk-edit", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Analytics endpoints
  analytics: {
    getAttendanceTrends: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
      return apiClient.request(`/api/analytics/trends${queryString}`)
    },

    getDepartmentStats: () =>
      apiClient.request("/api/analytics/department-stats"),

    getLowAttendanceStudents: () =>
      apiClient.request("/api/analytics/low-attendance"),

    exportAttendanceData: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
      return apiClient.request(`/api/analytics/export${queryString}`)
    },

    recordDailyAnalytics: (data: any) =>
      apiClient.request("/api/analytics/record-daily", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
}
