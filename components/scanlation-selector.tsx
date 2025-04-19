"use client"

import { useRouter } from "next/navigation"
import type { Scanlation } from "@/types/manga"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"

export default function ScanlationSelector({
  scanlations,
  currentScanlation,
  mangaSlug,
  chapterNumber,
}: {
  scanlations: Scanlation[]
  currentScanlation: string
  mangaSlug: string
  chapterNumber: number
}) {
  const router = useRouter()

  const handleScanlationChange = (value: string) => {
    router.push(`/manga/${mangaSlug}/${chapterNumber}/${value}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <Select value={currentScanlation} onValueChange={handleScanlationChange}>
        <SelectTrigger className="w-[200px] bg-muted/40 border-0 focus:ring-primary">
          <SelectValue placeholder="Seleccionar scanlation" />
        </SelectTrigger>
        <SelectContent>
          {scanlations.map((scanlation) => {
            const scanlationSlug = scanlation.nombre
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")

            return (
              <SelectItem key={scanlationSlug} value={scanlationSlug}>
                {scanlation.nombre}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
