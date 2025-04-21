import { getMangaBySlug } from "@/lib/manga"
import { notFound } from "next/navigation"
import Reader from "@/components/reader"
import ReaderControls from "@/components/reader-controls"
import ScanlationSelector from "@/components/scanlation-selector"
import { getChapterImages } from "@/lib/images"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function ChapterPage({
  params,
}: {
  params: Promise<{
    slug: string
    chapter: string
    scanlation: string
  }>
}) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const chapter = awaitedParams.chapter;
  const scanlation = awaitedParams.scanlation;

  const manga = await getMangaBySlug(slug);

  if (!manga) {
    notFound();
  }

  const chapterNumber = Number.parseInt(chapter, 10);
  const currentChapter = manga.capitulos.find((c) => c.numero === chapterNumber);

  if (!currentChapter) {
    notFound();
  }

  // Encontrar el scanlation seleccionado
  const currentScanlation = currentChapter.scanlations.find((s) => {
    // Convertir el nombre del scanlation a un formato de slug para comparar
    const scanlationSlug = s.nombre
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return scanlationSlug === scanlation;
  });

  if (!currentScanlation) {
    notFound();
  }

  // Determinar el tipo de serie basado en la URL
  const seriesType = manga.urlFuente.toLowerCase().includes("manhwa")
    ? "Manhwa"
    : manga.urlFuente.toLowerCase().includes("manhua")
      ? "Manhua"
      : "Manga"

  // Determinar el modo de lectura (para este ejemplo, asumimos que manhwa y manhua son cascada, manga es paginado)
  const readingMode = seriesType === "Manga" ? "paginated" : "cascade"

  // Obtener las imágenes del capítulo
  const images = await getChapterImages(slug, chapterNumber, scanlation);

  // Encontrar capítulos anterior y siguiente
  const sortedChapters = [...manga.capitulos].sort((a, b) => a.numero - b.numero)
  const currentChapterIndex = sortedChapters.findIndex((c) => c.numero === chapterNumber)

  const prevChapter = currentChapterIndex > 0 ? sortedChapters[currentChapterIndex - 1] : null
  const nextChapter = currentChapterIndex < sortedChapters.length - 1 ? sortedChapters[currentChapterIndex + 1] : null

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <Link
          href={`/manga/${slug}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver a detalles
        </Link>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{manga.titulo}</h1>
          <p className="text-lg text-muted-foreground">
            Capítulo {currentChapter.capituloTextoCompleto}
            {currentChapter.nombreAdicional ? `: ${currentChapter.nombreAdicional}` : ""}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <ScanlationSelector
          scanlations={currentChapter.scanlations}
          currentScanlation={scanlation}
          mangaSlug={slug}
          chapterNumber={chapterNumber}
        />

        <ReaderControls
          mangaSlug={slug}
          currentChapter={chapterNumber}
          prevChapter={prevChapter?.numero}
          nextChapter={nextChapter?.numero}
          currentScanlation={scanlation}
          prevScanlations={prevChapter?.scanlations}
          nextScanlations={nextChapter?.scanlations}
        />
      </div>

      <Reader images={images} readingMode={readingMode} />

      {/* Botones flotantes de navegación de capítulo */}
      <div className="fixed bottom-6 left-0 w-full flex justify-between px-6 pointer-events-none z-50">
        {prevChapter && (
          <Link
            href={`/manga/${slug}/${prevChapter.numero}/${encodeURIComponent(
              prevChapter.scanlations[0]?.nombre
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-") || ""
            )}`}
            className="pointer-events-auto flex items-center gap-2 bg-[#18181b] text-[#a3e635] hover:bg-[#23272f] transition-colors rounded-full shadow-lg px-6 py-4 text-lg font-bold"
            style={{ minWidth: 56, minHeight: 56 }}
          >
            <ChevronLeft className="h-6 w-6" />
            Anterior
          </Link>
        )}
        {nextChapter && (
          <Link
            href={`/manga/${slug}/${nextChapter.numero}/${encodeURIComponent(
              nextChapter.scanlations[0]?.nombre
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-") || ""
            )}`}
            className="pointer-events-auto flex items-center gap-2 bg-[#18181b] text-[#38bdf8] hover:bg-[#23272f] transition-colors rounded-full shadow-lg px-6 py-4 text-lg font-bold ml-auto"
            style={{ minWidth: 56, minHeight: 56 }}
          >
            Siguiente
            <ChevronLeft className="h-6 w-6 rotate-180" />
          </Link>
        )}
      </div>
    </div>
  )
}
