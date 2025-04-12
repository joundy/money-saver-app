import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/lib/context'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Money Saver',
  description: 'A simple app to track your finances',
  generator: 'Next.js',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
