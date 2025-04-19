import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
