import nodemailer from "nodemailer"

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter

  constructor() {
    // For mock email service in development
    if (process.env.MOCK_EMAIL_SERVICE === "true") {
      this.transporter = {
        sendMail: async (options: EmailOptions) => {
          console.log("Mock Email Service:")
          console.log(`To: ${options.to}`)
          console.log(`Subject: ${options.subject}`)
          console.log(`Body: ${options.html}`)
          return { messageId: "mock-message-id" }
        },
      }
    } else {
      // Production: Configure with actual email service
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }
  }

  async sendOTPEmail(email: string, otp: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Email Verification</h2>
          <p style="color: #4b5563; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; letter-spacing: 8px; font-size: 42px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      </div>
    `

    await this.transporter.sendMail({
      to: email,
      subject: "Email Verification Code - Student Management System",
      html: htmlContent,
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #2563eb; font-size: 12px; word-break: break-all; background-color: #eff6ff; padding: 10px; border-radius: 4px;">${resetLink}</p>
          <p style="color: #ef4444; font-size: 14px; margin-top: 20px;"><strong>This link expires in 1 hour.</strong></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
      </div>
    `

    await this.transporter.sendMail({
      to: email,
      subject: "Password Reset Request - Student Management System",
      html: htmlContent,
    })
  }

  async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Changed Successfully</h2>
          <p style="color: #4b5563; font-size: 16px;">Hi ${name},</p>
          <p style="color: #4b5563; font-size: 16px;">Your password has been successfully changed.</p>
          <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #065f46; margin: 0; font-size: 14px;"><strong>✓ Password updated</strong></p>
            <p style="color: #047857; margin: 5px 0 0 0; font-size: 12px;">Your account is now secured with the new password</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">If you did not make this change, please contact support immediately.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">For security reasons, we recommend using a strong, unique password.</p>
        </div>
      </div>
    `

    await this.transporter.sendMail({
      to: email,
      subject: "Password Changed - Student Management System",
      html: htmlContent,
    })
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Student Management System!</h2>
          <p style="color: #4b5563; font-size: 16px;">Hi ${name},</p>
          <p style="color: #4b5563; font-size: 16px;">Your account has been successfully created. We're excited to have you on board!</p>
          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;"><strong>What's next?</strong></p>
            <ul style="color: #3b82f6; margin: 10px 0; padding-left: 20px;">
              <li>Complete your profile</li>
              <li>Explore your dashboard</li>
              <li>Check your attendance records</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Get Started</a>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">If you have any questions, feel free to contact our support team.</p>
        </div>
      </div>
    `

    await this.transporter.sendMail({
      to: email,
      subject: "Welcome to Student Management System",
      html: htmlContent,
    })
  }
}
