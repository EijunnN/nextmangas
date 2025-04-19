"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Home, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">MangaReader</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild className={cn("rounded-full", pathname === "/" && "bg-muted")}>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Inicio</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={cn("rounded-full", pathname.startsWith("/search") && "bg-muted")}
            >
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Buscar</span>
              </Link>
            </Button>

            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
