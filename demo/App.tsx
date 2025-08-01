import { useEffect, useRef, useState } from "react"
import { AnnouncementRegion, AnnouncerProvider, useAnnouncer } from "../src"
import { type Announcement } from "../src/types"
import "./demo.css"

export default function App() {
  return (
    <AnnouncerProvider>
      {(announcements) => (
        <>
          <ComponentThatAnnounces />
          <AnotherComponentThatAnnounces />
          {/* use native component for accessibility */}
          <AnnouncementRegion announcements={announcements} />
          {/* use custom component */}
          <CustomAnnouncementRegion announcements={announcements} />
          {/* use logger annoucement component for debugging */}
          <LoggerAnnouncements announcements={announcements} />
        </>
      )}
    </AnnouncerProvider>
  )
}

function ComponentThatAnnounces() {
  const { announce } = useAnnouncer()

  return (
    <>
      <button onClick={() => announce({ message: "Hello from demo!" })}>
        Announce
      </button>
      <button
        onClick={() =>
          announce({ message: "Assertive hello from demo!", assertive: true })
        }
      >
        Announce assertive
      </button>
    </>
  )
}

function AnotherComponentThatAnnounces() {
  const { announce } = useAnnouncer()

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    if (e.currentTarget.open) {
      announce({ message: "component expanded" })
    } else {
      announce({ message: "component collapsed" })
    }
  }

  return (
    <details onToggle={handleToggle}>
      <summary>Test label</summary>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
        sequi impedit odio, voluptatem eum possimus perspiciatis distinctio
        blanditiis laboriosam temporibus sunt soluta. Nihil excepturi doloremque
        perspiciatis iure architecto. Nesciunt similique itaque corrupti
        architecto qui asperiores nemo perspiciatis odio ab, quisquam quod
        accusamus placeat cupiditate atque eveniet voluptatibus dolor minima,
        consequatur molestias aliquid dolorem? Neque temporibus totam a alias ea
        maiores consequuntur beatae placeat repudiandae exercitationem
        perferendis tempora vel, eaque delectus doloremque aspernatur aliquam
        enim, ipsa nobis error porro similique, blanditiis officiis nihil! Animi
        voluptas similique rem ducimus perspiciatis enim. Rerum repellendus
        eveniet optio unde ipsum nihil, dolor quam recusandae voluptates.
      </p>
    </details>
  )
}

function CustomAnnouncementRegion({
  announcements,
}: {
  announcements: Announcement[]
}) {
  const [modifiedAnnouncements, setModifiedAnnouncements] = useState<
    Announcement[]
  >([])

  const timeouts = useRef<Map<string | number, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const removedAnnouncementIds = useRef<Set<string | number>>(new Set())

  const addAutoClosedAnnouncement = (
    announcement: Announcement,
    timeout = 3000,
  ) => {
    if (
      modifiedAnnouncements.find((a) => a.id === announcement.id) ||
      removedAnnouncementIds.current.has(announcement.id)
    ) {
      return
    }

    setModifiedAnnouncements((prev) => [...prev, announcement])

    const timeoutId = setTimeout(() => {
      removedAnnouncementIds.current.add(announcement.id)
      setModifiedAnnouncements((prev) =>
        prev.filter(({ id }) => id !== announcement.id),
      )
      timeouts.current.delete(announcement.id)
    }, timeout)

    timeouts.current.set(announcement.id, timeoutId)
  }

  const deleteNotification = (id: string | number) => {
    const timeout = timeouts.current.get(id)
    if (timeout) clearTimeout(timeout)
    timeouts.current.delete(id)

    removedAnnouncementIds.current.add(id)
    setModifiedAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id),
    )
  }

  useEffect(() => {
    announcements.forEach((announcement) => {
      addAutoClosedAnnouncement(announcement, 5000)
    })
  }, [announcements])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeouts.current.clear()
    }
  }, [])

  return (
    <ul role="region" className="custom-region">
      {modifiedAnnouncements.map(({ id, message, assertive }) => (
        <li className={`message${assertive ? " assertive" : ""}`} key={id}>
          <span className="message-content">{message}</span>
          <button
            className="close-message"
            onClick={() => deleteNotification(id)}
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  )
}

function LoggerAnnouncements({
  announcements,
}: {
  announcements: Announcement[]
}) {
  const printedOutAnnoucements = useRef<(string | number)[]>([])

  useEffect(() => {
    announcements.forEach(({ id, message }) => {
      if (printedOutAnnoucements.current.includes(id)) return
      console.log(`[announce]: ${message}`)
      printedOutAnnoucements.current = [...printedOutAnnoucements.current, id]
    })
  }, [announcements])

  return null
}
