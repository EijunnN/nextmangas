import Link from "next/link"
import Image from "next/image"
import type { Manga } from "@/types/manga"
import { Badge } from "@/components/ui/badge"

export default function MangaGrid({ mangas }: { mangas: Manga[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {mangas.map((manga) => (
        <MangaCard key={manga.titulo} manga={manga} />
      ))}
    </div>
  )
}

function MangaCard({ manga }: { manga: Manga }) {
  // Generar slug desde el título
  const slug = manga.titulo
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

  // Determinar el tipo de serie basado en la URL
  const seriesType = manga.urlFuente.toLowerCase().includes("manhwa")
    ? "Manhwa"
    : manga.urlFuente.toLowerCase().includes("manhua")
      ? "Manhua"
      : "Manga"

  return (
    <Link href={`/manga/${slug}`} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl mb-3 bg-muted/20">
        <Image
          src={manga.thumbnail || "/placeholder.svg"}
          alt={manga.titulo}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge variant="secondary" className="absolute top-2 right-2 text-xs font-normal">
          {seriesType}
        </Badge>

        {manga.estado && (
          <Badge
            variant="outline"
            className="absolute bottom-2 left-2 text-xs font-normal bg-background/50 backdrop-blur-sm"
          >
            {manga.estado}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{manga.titulo}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{manga.generos.slice(0, 2).join(" • ")}</p>
      </div>
    </Link>
  )
}
