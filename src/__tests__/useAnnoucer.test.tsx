import React from "react"
import { renderHook } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useAnnouncer } from "../useAnnouncer"
import { AnnouncerProvider } from "../AnnouncerProvider"

describe("useAnnouncer", () => {
  it("throws error if used outside of AnnouncerProvider", () => {
    expect(() => renderHook(() => useAnnouncer())).toThrow(
      "useAnnouncer must be used within the AnnouncerProvider",
    )
  })

  it("returns context when used inside AnnouncerProvider", () => {
    const wrapper = ({ children }: any) => (
      <AnnouncerProvider>{() => children}</AnnouncerProvider>
    )

    const { result } = renderHook(() => useAnnouncer(), { wrapper })

    expect(result.current).toHaveProperty("announce")
    expect(typeof result.current.announce).toBe("function")
  })
})
