"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import type { Scanlation } from "@/types/manga"

export default function ReaderControls({
  mangaSlug,
  currentChapter,
  prevChapter,
  nextChapter,
  currentScanlation,
  prevScanlations,
  nextScanlations,
}: {
  mangaSlug: string
  currentChapter: number
  prevChapter?: number
  nextChapter?: number
  currentScanlation: string
  prevScanlations?: Scanlation[]
  nextScanlations?: Scanlation[]
}) {
  // Función para encontrar el mismo scanlation en otro capítulo o usar el primero disponible
  const findScanlationForChapter = (scanlations: Scanlation[] | undefined, currentScanlation: string): string => {
    if (!scanlations || scanlations.length === 0) return ""

    // Buscar el mismo scanlation
    const sameScanlation = scanlations.find((s) => {
      const scanlationSlug = s.nombre
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      return scanlationSlug === currentScanlation
    })

    // Si existe, usar el mismo scanlation, de lo contrario usar el primero
    if (sameScanlation) {
      return sameScanlation.nombre
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
    }

    // Usar el primer scanlation disponible
    return scanlations[0].nombre
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  }

  // Generar URLs para capítulos anterior y siguiente
  const prevChapterUrl = prevChapter
    ? `/manga/${mangaSlug}/${prevChapter}/${findScanlationForChapter(prevScanlations, currentScanlation)}`
    : null

  const nextChapterUrl = nextChapter
    ? `/manga/${mangaSlug}/${nextChapter}/${findScanlationForChapter(nextScanlations, currentScanlation)}`
    : null

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!prevChapterUrl}
        className="rounded-full bg-muted/40 border-0 hover:bg-muted"
      >
        <Link href={prevChapterUrl || "#"}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Link>
      </Button>

      <Button variant="outline" size="sm" asChild className="rounded-full bg-muted/40 border-0 hover:bg-muted">
        <Link href={`/manga/${mangaSlug}`}>
          <BookOpen className="h-4 w-4 mr-1" />
          Detalles
        </Link>
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={!nextChapterUrl}
        className="rounded-full bg-muted/40 border-0 hover:bg-muted"
      >
        <Link href={nextChapterUrl || "#"}>
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  )
}
