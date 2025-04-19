import fs from "fs/promises"
import path from "path"
import type { Manga } from "@/types/manga"
import { cache } from "react"

// Función para obtener la lista de mangas
export const getMangaList = cache(async (): Promise<Manga[]> => {
  try {
    // Leer el directorio de datos de manga
    const mangaDir = path.join(process.cwd(), "manga_data")
    const files = await fs.readdir(mangaDir)

    // Filtrar solo archivos JSON
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    // Leer y parsear cada archivo JSON
    const mangas = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(mangaDir, file)
        const fileContent = await fs.readFile(filePath, "utf-8")
        return JSON.parse(fileContent) as Manga
      }),
    )

    return mangas
  } catch (error) {
    console.error("Error al cargar los datos de manga:", error)
    return []
  }
})

// Función para obtener un manga por su slug
export const getMangaBySlug = cache(async (slug: string): Promise<Manga | null> => {
  const mangas = await getMangaList()

  // Buscar el manga por slug (generado a partir del título)
  const manga = mangas.find((manga) => {
    const mangaSlug = manga.titulo
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    return mangaSlug === slug
  })

  return manga || null
})
