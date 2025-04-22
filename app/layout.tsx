import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextManga",
  description: "Lee manga, manhwa y manhua sin necesidad de registro",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1">{children}
            <Analytics />
            </main>
          </div>
        </ThemeProvider>
      </body>
      
    </html>
  )
}
