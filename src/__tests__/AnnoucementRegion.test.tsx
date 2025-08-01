import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { AnnouncementRegion } from "../AnnouncementRegion"
import type { Announcement } from "../types"

describe("AnnouncementRegion", () => {
  const mockAnnouncements: Announcement[] = [
    { id: "1", message: "Message 1", assertive: false },
    { id: "2", message: "Message 2", assertive: true },
    { id: "3", message: "Message 3", assertive: false },
    { id: "4", message: "Message 4", assertive: true },
    { id: "5", message: "Message 5", assertive: false },
  ]

  it("renders nothing if no announcements", () => {
    render(<AnnouncementRegion announcements={[]} />)
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders announcements with correct roles", () => {
    render(<AnnouncementRegion announcements={mockAnnouncements.slice(0, 2)} />)

    expect(screen.getByRole("status")).toHaveTextContent("Message 1")
    expect(screen.getByRole("alert")).toHaveTextContent("Message 2")
  })

  it("limits number of rendered announcements by stackLimit", () => {
    render(
      <AnnouncementRegion announcements={mockAnnouncements} stackLimit={3} />,
    )

    const container =
      screen.getByRole("region", { hidden: true }) ||
      screen.getByRole("generic")

    const announcementsDivs = Array.from(
      container.querySelectorAll("div[role='alert'], div[role='status']"),
    )

    expect(announcementsDivs).toHaveLength(3)

    expect(announcementsDivs[0]).toHaveTextContent("Message 3")
    expect(announcementsDivs[1]).toHaveTextContent("Message 4")
    expect(announcementsDivs[2]).toHaveTextContent("Message 5")
  })

  it("applies visually hidden styles by default", () => {
    render(<AnnouncementRegion announcements={mockAnnouncements.slice(0, 1)} />)

    const wrapper = screen.getByRole("status").parentElement
    expect(wrapper).toHaveStyle({ position: "absolute" })
    expect(screen.getByRole("status")).toHaveStyle({ clip: "rect(0, 0, 0, 0)" })
  })

  it("uses sr-only class if srOnlySupported is true", () => {
    render(
      <AnnouncementRegion
        announcements={mockAnnouncements.slice(0, 1)}
        srOnlySupported={true}
      />,
    )

    expect(screen.getByRole("status").className).toContain("sr-only")
  })
})
