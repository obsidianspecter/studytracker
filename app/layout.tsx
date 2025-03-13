import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Study Tracker',
  description: 'Track your daily study time',
  generator: 'Study Tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
