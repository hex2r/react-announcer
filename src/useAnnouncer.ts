import React, { useContext } from "react"
import type { AnnouncerContextType } from "./types"
import { AnnouncerContext } from "./AnnouncerContext"

export const useAnnouncer = (): AnnouncerContextType => {
  const context = useContext(AnnouncerContext)

  if (!context)
    throw new Error("useAnnouncer must be used within the AnnouncerProvider")

  return context
}
