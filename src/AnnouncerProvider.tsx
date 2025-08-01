import React, { useState, useCallback, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import type { AnnounceFn, Announcement } from "./types"
import { AnnouncerContext } from "./AnnouncerContext"

type AnnouncerProvider = {
  children: (announcements: Announcement[]) => React.ReactNode
}

export const AnnouncerProvider = ({ children }: AnnouncerProvider) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const announce: AnnounceFn = useCallback(({ message, assertive = false }) => {
    const announcement: Announcement = { id: uuidv4(), message, assertive }
    setAnnouncements((state) => [...state, announcement])
  }, [])

  const memorizedAnnounce = useMemo(() => ({ announce }), [announce])

  return (
    <AnnouncerContext.Provider value={memorizedAnnounce}>
      {children(announcements)}
    </AnnouncerContext.Provider>
  )
}
