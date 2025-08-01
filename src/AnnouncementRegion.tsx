import React from "react"
import type { Announcement } from "./types"

const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
}

export type AnnouncementRegionProps = {
  announcements: Announcement[]
  srOnlySupported?: boolean
  stackLimit?: number
}

export function AnnouncementRegion({
  announcements,
  srOnlySupported = false,
  stackLimit = 4,
}: AnnouncementRegionProps) {
  const styles = srOnlySupported
    ? { className: "sr-only" }
    : { style: visuallyHidden }

  return (
    <div role="region" aria-live="polite" aria-atomic="true" {...styles}>
      {announcements.slice(-stackLimit).map(({ id, assertive, message }) => (
        <div
          key={id}
          role={assertive ? "alert" : "status"}
          aria-live={assertive ? "assertive" : "polite"}
          {...styles}
        >
          {message}
        </div>
      ))}
    </div>
  )
}
