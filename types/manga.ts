export interface Manga {
  urlFuente: string
  titulo: string
  thumbnail: string
  descripcion: string
  generos: string[]
  estado: string
  capitulos: Chapter[]
}

export interface Chapter {
  capituloTextoCompleto: string
  numero: number
  nombreAdicional: string | null
  scanlations: Scanlation[]
}

export interface Scanlation {
  nombre: string
  linkGrupo: string
  linkCapitulo: string
  fecha: string
  src: string[]
}
