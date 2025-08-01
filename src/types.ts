export type AnnouncerEvent = {
  message: string
  assertive?: boolean
}

export type PropsWithId = {
  id: string
}

export type Announcement = PropsWithId & AnnouncerEvent

export type AnnounceFn = (e: AnnouncerEvent) => void

export type AnnouncerContextType = {
  announce: AnnounceFn
}
