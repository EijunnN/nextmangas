import { Badge } from "@/components/ui/badge"

export default function GenreTag({ genre }: { genre: string }) {
  return (
    <Badge variant="outline" className="text-xs font-normal bg-muted/40 hover:bg-muted/60">
      {genre}
    </Badge>
  )
}
