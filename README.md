# react-announcer

Accessible announcer component for React apps using the Context API.  
Renders live-region messages for screen readers and provides a simple hook for dispatching announcements from anywhere in your component tree.

> 🔊 Perfect for accessibility-friendly UIs, form feedback, status updates, or dynamic ARIA alerts.

---

## 📦 Installation

**npm:**

```bash
npm install --save-dev hex2r/react-announcer
```

**pnpm:**

```bash
pnpm install --save-dev hex2r/react-announcer
```

**yarn:**

```bash
yarn add --save-dev hex2r/react-announcer
```

### Peer Dependencies

`react version ^18.0.0`

### 🔍 Description

This package simplifies the process of announcing messages to screen readers by:

Managing announcements via React Context

Offering a default AnnouncementRegion component (screen reader only)

Allowing you to create your own custom rendering of announcements

Supporting both polite and assertive modes for Screen Readers

### Usage in your components

```jsx
const { announce } = useAnnouncer()

...
const handleClick = () => {
  announce({ message: "Assertive hello from demo!", assertive: true })
}
...
```

### 📦 API Reference

`<AnnouncerProvider>`

Wraps your app and provides announcements state and dispatch function via context.

```jsx
<AnnouncerProvider>
  {(announcements) => (
    <>
      <AnnouncementRegion announcements={announcements} />
      {/* ... */}
    </>
  )}
</AnnouncerProvider>
```

`useAnnouncer() hook`

Hook to dispatch announcements.

```jsx
const { announce } = useAnnouncer()
announce({ message: "User created", assertive: false })
```

`AnnouncementRegion`

Component that renders screen-reader accessible messages

| Prop              | Type             | Default | Description                                                        |
| ----------------- | ---------------- | ------- | ------------------------------------------------------------------ |
| `announcements`   | `Announcement[]` | —       | List of current announcements                                      |
| `srOnlySupported` | `boolean`        | `false` | Use `className="sr-only"` instead of inline visually hidden styles |
| `stackLimit`      | `number`         | `4`     | Number of last announcements to display                            |

```jsx
<AnnouncementRegion
  announcements={announcements}
  srOnlySupported
  stackLimit={3}
/>
```

### ♿ Accessibility Notes

The `AnnouncementRegion` component ensures that assistive technology is notified of updates using `aria-live` and appropriate roles (`status` for `polite`, `alert` for `assertive`).

If you're using Tailwind or already have an `.sr-only` class, you can pass `srOnlySupported={true}` to avoid inline styles.

Supports announcing multiple messages with `stackLimit`.
