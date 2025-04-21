// import { cache } from "react";
// // Importa los metadatos directamente desde el archivo JSON
// import mangaMetadata from '../manga-metadata.json'; // Asegúrate que la ruta sea correcta desde images.ts

// // Definimos un tipo para la estructura esperada de los metadatos para mejor autocompletado y seguridad de tipos
// // Ajusta esto si la estructura de tu JSON es diferente
// type MangaMetadata = {
//   [mangaSlug: string]: {
//     [chapterNumber: string]: { // Los números de capítulo pueden ser keys de objeto (strings) en JSON
//       [scanlationSlug: string]: {
//         pageCount: number;
//       };
//     };
//   };
// };

// // Casteamos los metadatos importados a nuestro tipo definido
// const metadata: MangaMetadata = mangaMetadata;

// // Helper para formatear el número de página (ej: 1 -> 001, 12 -> 012)
// const formatPageNumber = (num: number): string => {
//   return String(num).padStart(3, '0'); // Ajusta el '3' si usas más o menos dígitos
// };

// export const getChapterImages = cache(
//   async (
//     mangaSlug: string,
//     chapterNumber: number, // Mantenemos number aquí por conveniencia
//     scanlationSlug: string
//   ): Promise<string[]> => {
//     const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

//     // Verifica que la variable de entorno esté configurada
//     if (!baseUrl) {
//       console.error("Error: La variable de entorno NEXT_PUBLIC_R2_PUBLIC_URL no está definida.");
//       return [];
//     }

//     let pageCount = 0;
//     try {
//       // Accede a los metadatos usando los parámetros.
//       // Convierte chapterNumber a string si las keys en tu JSON son strings.
//       // El operador ?. (optional chaining) previene errores si un nivel no existe.
//       pageCount = metadata[mangaSlug]?.[String(chapterNumber)]?.[scanlationSlug]?.pageCount ?? 0;
//     } catch (error) {
//       console.error(`Error al acceder a los metadatos para ${mangaSlug} / ${chapterNumber} / ${scanlationSlug}:`, error);
//       pageCount = 0; // Asegura que pageCount sea 0 en caso de error
//     }


//     // Verifica que se encontró un pageCount válido
//     if (pageCount <= 0) {
//       console.warn(`Advertencia: No se encontró pageCount o es 0 para ${mangaSlug} cap ${chapterNumber} scan ${scanlationSlug} en manga-metadata.json.`);
//       return [];
//     }

//     const imageUrls: string[] = [];
//     const basePath = `manga_images/${mangaSlug}/chapter-${chapterNumber}/${scanlationSlug}`;

//     // Genera una URL para cada página, asumiendo nombres como 000.webp, 001.webp, ...
//     for (let i = 0; i < pageCount; i++) {
//       const pageFileName = `${formatPageNumber(i)}.webp`; // Asume extensión .webp
//       const fullUrl = `${baseUrl}/${basePath}/${pageFileName}`;
//       imageUrls.push(fullUrl);
//     }

//     return imageUrls;
//   }
// );

// --- Recordatorio ---
// Ya no necesitas pasar pageCount cuando llames a getChapterImages.
// Ejemplo de cómo lo llamarías ahora:
//
// async function MyPageComponent({ params }) {
//   const { slug, chapter } = params;
//   // Obtén scanlationSlug de donde sea necesario
//   const scanlation = await getScanlationSlugForChapter(slug, chapter);
//
//   // Llama a la función SIN pageCount
//   const images = await getChapterImages(slug, Number(chapter), scanlation); // Asegúrate que chapter sea number si es necesario
//
//   return <NextManga images={images} />;
// }



// -----------------------------SOLUCION CON BACKBLAZE----------------------------------------------------


import { cache } from "react";
// Importa los metadatos directamente desde el archivo JSON
import mangaMetadata from '../manga-metadata.json'; // Asegúrate que la ruta sea correcta desde images.ts

// Definimos un tipo para la estructura esperada de los metadatos
type MangaMetadata = {
  [mangaSlug: string]: {
    [chapterNumber: string]: {
      [scanlationSlug: string]: {
        pageCount: number;
      };
    };
  };
};

// Casteamos los metadatos importados a nuestro tipo definido
const metadata: MangaMetadata = mangaMetadata;

// Helper para formatear el número de página (ej: 1 -> 001, 12 -> 012)
const formatPageNumber = (num: number): string => {
  return String(num).padStart(3, '0'); // Ajusta el '3' si usas más o menos dígitos
};


export const getChapterImages = cache(
  async (
    mangaSlug: string,
    chapterNumber: number, // Mantenemos number aquí por conveniencia
    scanlationSlug: string
  ): Promise<string[]> => {
    // --- ¡CAMBIO PRINCIPAL AQUÍ! ---
    // Lee la variable de entorno que definiste para la URL base de Backblaze B2
    // Asegúrate que esta variable exista en tu archivo .env.local
    const baseUrl = process.env.NEXT_PUBLIC_B2_PUBLIC_URL_BASE;

    // Verifica que la variable de entorno esté configurada
    if (!baseUrl) {
      console.error("Error: La variable de entorno NEXT_PUBLIC_B2_PUBLIC_URL_BASE no está definida.");
      return [];
    }

    let pageCount = 0;
    try {
      // Accede a los metadatos usando los parámetros.
      // Convierte chapterNumber a string porque las claves en JSON son strings.
      pageCount = metadata[mangaSlug]?.[String(chapterNumber)]?.[scanlationSlug]?.pageCount ?? 0;
    } catch (error) {
      console.error(`Error al acceder a los metadatos para ${mangaSlug} / ${chapterNumber} / ${scanlationSlug}:`, error);
      pageCount = 0; // Asegura que pageCount sea 0 en caso de error
    }


    // Verifica que se encontró un pageCount válido
    if (pageCount <= 0) {
      console.warn(`Advertencia: No se encontró pageCount o es 0 para ${mangaSlug} cap ${chapterNumber} scan ${scanlationSlug} en manga-metadata.json.`);
      return [];
    }

    const imageUrls: string[] = [];
    // La estructura de la ruta relativa DENTRO del bucket sigue siendo la misma
    const relativePathBase = `manga_images/${mangaSlug}/chapter-${chapterNumber}/${scanlationSlug}`;

    // Genera una URL para cada página, asumiendo nombres como 000.webp, 001.webp, ...
    for (let i = 0; i < pageCount; i++) {
      const pageFileName = `${formatPageNumber(i)}.webp`; // Asume extensión .webp
      // Construye la URL final concatenando la base de B2 y la ruta relativa
      const fullUrl = `${baseUrl}/${relativePathBase}/${pageFileName}`;
      imageUrls.push(fullUrl);
    }

    return imageUrls;
  }
);

// --- Recordatorio ---
// Llama a esta función desde tu código de servidor/componente sin pasar pageCount.
// Ejemplo:
//
// async function MyPageComponent({ params }) {
//   const { slug, chapter } = params;
//   // Obtén scanlationSlug de donde sea necesario
//   const scanlation = await getScanlationSlugForChapter(slug, chapter);
//
//   const images = await getChapterImages(slug, Number(chapter), scanlation);
//
//   return <MangaReader images={images} />;
// }


