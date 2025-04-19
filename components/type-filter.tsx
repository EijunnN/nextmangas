"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, BookText, BookType } from "lucide-react"

export default function TypeFilter({ types }: { types: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    setSelectedType(searchParams.get("type"))
  }, [searchParams])

  const handleTypeClick = (type: string) => {
    const newType = selectedType === type.toLowerCase() ? null : type.toLowerCase()
    setSelectedType(newType)

    const params = new URLSearchParams(searchParams.toString())
    if (newType) {
      params.set("type", newType)
    } else {
      params.delete("type")
    }

    router.push(`/?${params.toString()}`)
  }

  // Mapear tipos a iconos
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "manga":
        return <BookOpen className="h-4 w-4" />
      case "manhwa":
        return <BookText className="h-4 w-4" />
      case "manhua":
        return <BookType className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <Button
          key={type}
          variant={selectedType === type.toLowerCase() ? "default" : "outline"}
          onClick={() => handleTypeClick(type)}
          className="rounded-full"
          size="sm"
        >
          {getTypeIcon(type)}
          <span className="ml-2">{type}</span>
        </Button>
      ))}
    </div>
  )
}
