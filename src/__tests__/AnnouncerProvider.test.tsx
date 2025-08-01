import React from "react"
import "@testing-library/jest-dom"
import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { AnnouncerProvider, AnnouncerContext } from ".."
import type { AnnounceFn } from "../types"

// Mock uuid v4
vi.mock("uuid", () => {
  return {
    v4: vi
      .fn()
      .mockReturnValueOnce("id-0")
      .mockReturnValueOnce("id-1")
      .mockReturnValueOnce("id-2"),
  }
})

describe("AnnouncerProvider", () => {
  it("renders children with empty announcements initially", () => {
    const childFn = vi.fn(() => <div>Children Rendered</div>)

    render(<AnnouncerProvider>{childFn}</AnnouncerProvider>)

    expect(childFn).toHaveBeenCalledWith([])
    expect(screen.getByText("Children Rendered")).toBeInTheDocument()
  })

  it("adds announcement when announce is called", async () => {
    // Component that uses announce from context and calls it on mount
    function Consumer() {
      const context = React.useContext(AnnouncerContext)
      if (!context)
        throw new Error("AnnouncerContext must be used within provider")

      const { announce } = context

      React.useEffect(() => {
        context.announce({ message: "Hello World", assertive: true })
      }, [announce])

      return <div>Consumer rendered</div>
    }

    let receivedAnnouncements: any = null
    // Render AnnouncerProvider passing a children render function
    render(
      <AnnouncerProvider>
        {(announcements) => {
          receivedAnnouncements = announcements
          return <Consumer />
        }}
      </AnnouncerProvider>,
    )

    await waitFor(() => {
      expect(receivedAnnouncements).toHaveLength(1)
      expect(receivedAnnouncements[0]).toMatchObject({
        id: "id-0",
        message: "Hello World",
        assertive: true,
      })
    })

    // Wait for React state update (you can also use waitFor if async)
    // But here, a simple next tick
    await new Promise((r) => setTimeout(r, 0))

    // After announce called, announcements array updates
    expect(receivedAnnouncements).toHaveLength(1)
    expect(receivedAnnouncements[0]).toMatchObject({
      message: "Hello World",
      assertive: true,
    })

    // The Consumer component rendered
    expect(screen.getByText("Consumer rendered")).toBeInTheDocument()
  })

  it("adds multiple announcements correctly", async () => {
    let announceFn: AnnounceFn | null = null

    function Consumer() {
      const context = React.useContext(AnnouncerContext)
      if (!context) {
        throw new Error(
          "AnnouncerContext must be used within an AnnouncerProvider",
        )
      }
      announceFn = context.announce
      return <div>Consumer</div>
    }

    let receivedAnnouncements: any = null

    const childFn = (announcements: any) => {
      receivedAnnouncements = announcements
      return <Consumer />
    }

    render(<AnnouncerProvider>{childFn}</AnnouncerProvider>)
    ;(announceFn as AnnounceFn | null)?.({ message: "First" })
    ;(announceFn as AnnounceFn | null)?.({ message: "Second", assertive: true })

    await waitFor(() => {
      expect(receivedAnnouncements).toHaveLength(2)
      expect(receivedAnnouncements[0]).toMatchObject({
        id: "id-1",
        message: "First",
        assertive: false,
      })
      expect(receivedAnnouncements[1]).toMatchObject({
        id: "id-2",
        message: "Second",
        assertive: true,
      })
    })
  })
})
