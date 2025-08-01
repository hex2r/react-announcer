import React from "react"
import { createContext } from "react"
import type { AnnouncerContextType } from "./types"

export const AnnouncerContext = createContext<AnnouncerContextType | undefined>(
  undefined,
)
