"use client"

import { useEffect } from "react"

export function useKeyPress(targetKey: string, handler: () => void, deps: any[] = []) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [targetKey, handler, ...deps])
}
