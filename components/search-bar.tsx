"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Buscar manga, manhwa o manhua..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-12 rounded-full bg-muted/40 border-0 focus-visible:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10"
        >
          Buscar
        </Button>
      </div>
    </form>
  )
}
