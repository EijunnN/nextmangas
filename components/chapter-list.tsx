'use client'
import Link from "next/link"
import type { Chapter } from "@/types/manga"
import { Calendar, Users } from "lucide-react"
import { useState } from "react"

export default function ChapterList({
  chapters,
  mangaSlug,
  readingMode,
}: {
  chapters: Chapter[]
  mangaSlug: string
  readingMode: "cascade" | "paginated"
}) {
  // Ordenar capítulos de más reciente a más antiguo
  const sortedChapters = [...chapters].sort((a, b) => b.numero - a.numero)

  const [selectedChapter, setSelectedChapter] = useState("")

  // Generar opciones únicas para el select
  const chapterOptions = sortedChapters.map((chapter, index) => ({
    key: `${chapter.numero}-${index}`,
    value: `${chapter.numero}-${index}`,
    numero: chapter.numero,
    capituloTextoCompleto: chapter.capituloTextoCompleto,
  }))

  // Filtrar capítulos por selección
  const filteredChapters = selectedChapter
    ? [sortedChapters[parseInt(selectedChapter.split("-")[1], 10)]]
    : sortedChapters

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{chapters.length} capítulos</div>
      </div>

      <div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-primary text-sm mb-2"
        >
          <option value="">Todos los capítulos</option>
          {chapterOptions.map((opt) => (
            <option key={opt.key} value={opt.value}>
              Capítulo {opt.capituloTextoCompleto}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filteredChapters.map((chapter, index) => (
          <ChapterItem key={`${chapter.numero}-${index}`} chapter={chapter} mangaSlug={mangaSlug} />
        ))}
        {filteredChapters.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">No se encontraron capítulos.</div>
        )}
      </div>
    </div>
  )
}

function ChapterItem({ chapter, mangaSlug }: { chapter: Chapter; mangaSlug: string }) {
  // Obtener el primer scanlation para el enlace
  const firstScanlation = chapter.scanlations[0]

  if (!firstScanlation) {
    return null
  }

  // Convertir el nombre del scanlation a un formato de slug
  const scanlationSlug = firstScanlation.nombre
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

  return (
    <Link
      href={`/manga/${mangaSlug}/${chapter.numero}/${scanlationSlug}`}
      className="block p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="font-medium">Capítulo {chapter.capituloTextoCompleto}</div>
          {chapter.nombreAdicional && <div className="text-sm text-muted-foreground">{chapter.nombreAdicional}</div>}
        </div>

        <div className="flex items-center gap-3">
          {chapter.scanlations.length > 1 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{chapter.scanlations.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(firstScanlation.fecha).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
