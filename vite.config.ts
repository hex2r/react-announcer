import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  root: "./demo",
  plugins: [react()],
  build: {
    outDir: "../demo-dist",
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts", // optional, see below
    include: ["../src/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
})
