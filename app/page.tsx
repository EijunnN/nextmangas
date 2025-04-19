import { getMangaList } from "@/lib/manga"
import MangaGrid from "@/components/manga-grid"
import SearchBar from "@/components/search-bar"
import TypeFilter from "@/components/type-filter"
import { Suspense } from "react"
import { Sparkles } from "lucide-react"

export default async function Home() {
  const mangas = await getMangaList()

  // Extraer tipos únicos (manga, manhwa, manhua)
  const types = [
    ...new Set(
      mangas.map((manga) => {
        const url = manga.urlFuente.toLowerCase()
        if (url.includes("manhwa")) return "Manhwa"
        if (url.includes("manhua")) return "Manhua"
        return "Manga"
      }),
    ),
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16 space-y-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Descubre</h1>
          </div>
          <p className="text-muted-foreground">Explora nuestra colección de manga, manhwa y manhua</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <SearchBar />
          </div>
          <div className="w-full md:w-1/3">
            <TypeFilter types={types} />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Populares</h2>
        <Suspense fallback={<div className="text-muted-foreground">Cargando mangas...</div>}>
          <MangaGrid mangas={mangas} />
        </Suspense>
      </section>
    </div>
  )
}
