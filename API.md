# API Documentation

Complete API reference for the Student Management System.

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-api-domain.com/api
```

## Authentication

All endpoints (except public ones) require Bearer token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Getting a Token

**POST /auth/login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "password123"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@college.edu",
    "role": "student",
    "name": "John Doe"
  }
}
```

---

## Auth Endpoints

### Student Registration

**POST /auth/signup**

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.edu",
    "password": "securePassword123",
    "rollNumber": "CS001",
    "courseId": "507f1f77bcf86cd799439011",
    "branchId": "507f1f77bcf86cd799439012"
  }'
```

Response: `201 Created`
```json
{
  "message": "Student registered successfully",
  "userId": "507f1f77bcf86cd799439013",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Admin Registration

**POST /auth/admin/signup**

```bash
curl -X POST http://localhost:3001/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@college.edu",
    "password": "securePassword123",
    "department": "CSE"
  }'
```

### Login

**POST /auth/login**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "securePassword123"
  }'
```

### Verify Email OTP

**POST /auth/verify-otp**

```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "otp": "123456"
  }'
```

### Refresh Token

**POST /auth/refresh-token**

```bash
curl -X POST http://localhost:3001/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

### Password Reset

**POST /auth/password-reset**

```bash
curl -X POST http://localhost:3001/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "newPassword": "newSecurePassword123",
    "resetToken": "token-from-email"
  }'
```

---

## Attendance Endpoints

### Mark Attendance

**POST /attendance/mark**

Requires: `admin` or `faculty` role

```bash
curl -X POST http://localhost:3001/api/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "studentId": "507f1f77bcf86cd799439011",
    "subjectId": "507f1f77bcf86cd799439012",
    "courseId": "507f1f77bcf86cd799439013",
    "section": "A",
    "status": "present"
  }'
```

Response: `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "studentId": "507f1f77bcf86cd799439011",
  "subjectId": "507f1f77bcf86cd799439012",
  "courseId": "507f1f77bcf86cd799439013",
  "section": "A",
  "status": "present",
  "date": "2024-01-15T10:30:00Z",
  "remarkedBy": "507f1f77bcf86cd799439015"
}
```

### Get Student Attendance

**GET /attendance/student/:studentId**

Query Parameters:
- `subjectId` (optional): Filter by subject
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

```bash
curl -X GET "http://localhost:3001/api/attendance/student/507f1f77bcf86cd799439011?subjectId=507f1f77bcf86cd799439012&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <token>"
```

Response: `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "studentId": "507f1f77bcf86cd799439011",
    "subjectId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Data Structures",
      "code": "DS101"
    },
    "status": "present",
    "date": "2024-01-15T10:30:00Z"
  }
]
```

### Get Subject Attendance

**GET /attendance/subject/:subjectId**

Requires: `admin` or `faculty` role

Query Parameters:
- `section` (optional): Filter by section
- `startDate` (optional): Start date
- `endDate` (optional): End date

```bash
curl -X GET "http://localhost:3001/api/attendance/subject/507f1f77bcf86cd799439012?section=A" \
  -H "Authorization: Bearer <token>"
```

### Get Attendance Statistics

**GET /attendance/stats**

Query Parameters:
- `studentId` (optional): Get stats for specific student
- `subjectId` (optional): Get stats for specific subject

```bash
curl -X GET "http://localhost:3001/api/attendance/stats?studentId=507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <token>"
```

Response: `200 OK`
```json
{
  "total": 30,
  "breakdown": {
    "present": 25,
    "absent": 3,
    "late": 2
  },
  "percentage": {
    "present": 83,
    "absent": 10,
    "late": 7
  }
}
```

### Edit Attendance Record

**PUT /attendance/:attendanceId**

Requires: `admin` or `faculty` role

```bash
curl -X PUT http://localhost:3001/api/attendance/507f1f77bcf86cd799439014 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "late"
  }'
```

### Delete Attendance Record

**DELETE /attendance/:attendanceId**

Requires: `admin` or `faculty` role

```bash
curl -X DELETE http://localhost:3001/api/attendance/507f1f77bcf86cd799439014 \
  -H "Authorization: Bearer <token>"
```

### Bulk Edit Attendance

**POST /attendance/bulk-edit**

Requires: `admin` or `faculty` role

```bash
curl -X POST http://localhost:3001/api/attendance/bulk-edit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "updates": [
      {"attendanceId": "507f1f77bcf86cd799439014", "status": "present"},
      {"attendanceId": "507f1f77bcf86cd799439015", "status": "absent"},
      {"attendanceId": "507f1f77bcf86cd799439016", "status": "late"}
    ]
  }'
```

---

## Analytics Endpoints

### Get Attendance Trends

**GET /analytics/trends**

Query Parameters:
- `courseId`: Course ID (required)
- `days`: Number of days to retrieve (default: 30)

```bash
curl -X GET "http://localhost:3001/api/analytics/trends?courseId=507f1f77bcf86cd799439013&days=30" \
  -H "Authorization: Bearer <token>"
```

Response: `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "courseId": "507f1f77bcf86cd799439013",
    "sectionId": "A",
    "date": "2024-01-15T00:00:00Z",
    "totalStudents": 50,
    "presentCount": 45,
    "absentCount": 3,
    "lateCount": 2,
    "attendancePercentage": 90
  }
]
```

### Get Department Statistics

**GET /analytics/department-stats**

Query Parameters:
- `courseId` (optional): Get stats for specific course

```bash
curl -X GET "http://localhost:3001/api/analytics/department-stats?courseId=507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer <token>"
```

Response: `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "avgAttendance": 82.5,
  "totalRecords": 1500,
  "highestAttendance": 95,
  "lowestAttendance": 45
}
```

### Get Low Attendance Students

**GET /analytics/low-attendance**

Query Parameters:
- `courseId`: Course ID (required)
- `threshold`: Attendance threshold in % (default: 75)

```bash
curl -X GET "http://localhost:3001/api/analytics/low-attendance?courseId=507f1f77bcf86cd799439013&threshold=75" \
  -H "Authorization: Bearer <token>"
```

### Export Attendance Data

**GET /analytics/export**

Query Parameters:
- `courseId` (optional): Filter by course
- `startDate` (optional): Start date
- `endDate` (optional): End date

Returns: CSV file

```bash
curl -X GET "http://localhost:3001/api/analytics/export?courseId=507f1f77bcf86cd799439013&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <token>" \
  -o attendance-export.csv
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "message": "Missing required field: studentId"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- Standard tier: 100 requests per minute
- Premium tier: 1000 requests per minute

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642345678
```

---

## Webhook Events

Subscribe to events via POST to your webhook URL:

- `attendance.marked` - When attendance is marked
- `attendance.updated` - When attendance is updated
- `student.registered` - When new student registers
- `low_attendance_alert` - When student drops below threshold

Example payload:
```json
{
  "event": "attendance.marked",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "attendanceId": "507f1f77bcf86cd799439014",
    "studentId": "507f1f77bcf86cd799439011",
    "status": "present"
  }
}
