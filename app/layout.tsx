import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/hooks/use-auth'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Student Management System',
  description: 'Modern student management and attendance tracking system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GoogleOAuthProvider clientId="225793238863-09f10p2q8v6cf9ktshr8svtjqfis1j4u.apps.googleusercontent.com">
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
