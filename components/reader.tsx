"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useKeyPress } from "@/hooks/use-key-press"

export default function Reader({
  images,
  readingMode,
}: {
  images: string[]
  readingMode: "cascade" | "paginated"
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Manejar navegación con teclado para modo paginado
  useKeyPress("ArrowRight", () => {
    if (readingMode === "paginated" && currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  })

  useKeyPress("ArrowLeft", () => {
    if (readingMode === "paginated" && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  })

  // Scroll al inicio cuando cambian las imágenes
  useEffect(() => {
    window.scrollTo(0, 0)
    setCurrentPage(0)
  }, [images])

  // Manejar fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-muted/20 rounded-xl">
        <p className="text-muted-foreground">No hay imágenes disponibles para este capítulo.</p>
      </div>
    )
  }

  if (readingMode === "cascade") {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
        <CascadeReader images={images} />
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFullscreen}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </Button>
      <PaginatedReader images={images} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

function CascadeReader({ images }: { images: string[] }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {images.map((image, index) => (
        <div key={index} className="w-full max-w-3xl">
          <div className="relative aspect-auto w-full bg-muted/20 rounded-lg overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Página ${index + 1}`}
              width={800}
              height={1200}
              className="w-full h-auto"
              priority={index < 3} // Cargar con prioridad las primeras imágenes
              loading={index < 3 ? "eager" : "lazy"} // Lazy loading para el resto
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PaginatedReader({
  images,
  currentPage,
  setCurrentPage,
}: {
  images: string[]
  currentPage: number
  setCurrentPage: (page: number) => void
}) {
  const goToNextPage = () => {
    if (currentPage < images.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-4xl mx-auto">
        <div
          className="relative aspect-[2/3] w-full bg-muted/20 rounded-xl overflow-hidden cursor-pointer"
          onClick={goToNextPage}
        >
          <Image
            src={images[currentPage] || "/placeholder.svg"}
            alt={`Página ${currentPage + 1}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground rounded-full p-2 shadow-lg backdrop-blur-sm"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Página anterior</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 text-foreground rounded-full p-2 shadow-lg backdrop-blur-sm"
          onClick={goToNextPage}
          disabled={currentPage === images.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Página siguiente</span>
        </Button>
      </div>

      <div className="mt-6 text-center bg-muted/30 px-4 py-2 rounded-full">
        <p className="text-sm">
          Página {currentPage + 1} de {images.length}
        </p>
      </div>
    </div>
  )
}
