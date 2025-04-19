import { getMangaBySlug, getMangaList } from "@/lib/manga"
import Image from "next/image"
import { notFound } from "next/navigation"
import ChapterList from "@/components/chapter-list"
import GenreTag from "@/components/genre-tag"
import { BookOpen, Calendar, Layers } from "lucide-react"

export async function generateStaticParams() {
  const mangas = await getMangaList()
  return mangas.map((manga) => ({
    slug: getSlugFromTitle(manga.titulo),
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params
  const slug = awaitedParams.slug
  const manga = await getMangaBySlug(slug)

  if (!manga) {
    return {
      title: "Manga no encontrado",
    }
  }

  return {
    title: `${manga.titulo} | Manga Reader`,
    description: manga.descripcion,
  }
}

export default async function MangaPage({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params
  const slug = awaitedParams.slug
  const manga = await getMangaBySlug(slug)

  if (!manga) {
    notFound()
  }

  // Determinar el tipo de serie basado en la URL
  const seriesType = manga.urlFuente.toLowerCase().includes("manhwa")
    ? "Manhwa"
    : manga.urlFuente.toLowerCase().includes("manhua")
      ? "Manhua"
      : "Manga"

  // Determinar el modo de lectura (para este ejemplo, asumimos que manhwa y manhua son cascada, manga es paginado)
  const readingMode = seriesType === "Manga" ? "paginated" : "cascade"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-8">
            <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto overflow-hidden rounded-xl">
              <Image
                src={manga.thumbnail || "/placeholder.svg"}
                alt={manga.titulo}
                fill
                className="object-cover transition-transform hover:scale-105 duration-300"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Información
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium">{seriesType}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="font-medium">{manga.estado}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                    <span className="text-muted-foreground">Modo de lectura</span>
                    <span className="font-medium capitalize">{readingMode === "cascade" ? "Cascada" : "Paginado"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Géneros
                </h2>
                
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{manga.titulo}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Actualizado recientemente</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Sinopsis</h2>
            <p className="text-muted-foreground leading-relaxed">{manga.descripcion}</p>
            <div className="flex flex-wrap gap-2">
            {manga.generos.map((genero) => (
                    <GenreTag key={genero} genre={genero} />
                  ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Capítulos</h2>
            <ChapterList chapters={manga.capitulos} mangaSlug={slug} readingMode={readingMode} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Función auxiliar para generar slug desde título
function getSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}
