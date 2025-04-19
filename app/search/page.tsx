import { getMangaList } from "@/lib/manga"
import MangaGrid from "@/components/manga-grid"
import SearchBar from "@/components/search-bar"
import { Suspense } from "react"
import { Search } from "lucide-react"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const awaitedSearchParams = await searchParams
  const params = awaitedSearchParams
  const query = params.q || ""
  const type = params.type || ""

  const mangas = await getMangaList()

  // Filtrar mangas por búsqueda y tipo
  const filteredMangas = mangas.filter((manga) => {
    const matchesQuery = query ? manga.titulo.toLowerCase().includes(query.toLowerCase()) : true

    const mangaType = manga.urlFuente.toLowerCase().includes("manhwa")
      ? "manhwa"
      : manga.urlFuente.toLowerCase().includes("manhua")
        ? "manhua"
        : "manga"

    const matchesType = type ? mangaType === type.toLowerCase() : true

    return matchesQuery && matchesType
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 space-y-6">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Resultados</h1>
        </div>
        <div className="w-full max-w-2xl">
          <SearchBar defaultValue={query} />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight text-muted-foreground">
          {filteredMangas.length > 0
            ? `${filteredMangas.length} resultados encontrados`
            : "No se encontraron resultados"}
        </h2>
        <Suspense fallback={<div className="text-muted-foreground">Cargando resultados...</div>}>
          <MangaGrid mangas={filteredMangas} />
        </Suspense>
      </section>
    </div>
  )
}
