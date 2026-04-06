# Design System

## Color Tokens (CSS custom properties via Tailwind)

| Token | Usage |
|---|---|
| `bg-background` | Page background |
| `text-foreground` | Primary text |
| `bg-primary` / `text-primary-foreground` | Primary actions, buttons |
| `bg-secondary` / `text-secondary-foreground` | Cards, subtle surfaces, active nav items |
| `bg-muted` / `text-muted-foreground` | Placeholder text, captions, inactive nav items |
| `border-border` | Dividers, card borders, input borders |

### Semantic Colors (inline HSL, used only when no token maps to the intent)

| Intent | Value | Usage |
|---|---|---|
| Success | `hsl(142 71% 45%)` | Correct answer feedback |
| Danger | `hsl(0 72% 51%)` | Wrong answer feedback |

> Use inline `style` with these HSL values only for pass/fail feedback states. Do not introduce new ad-hoc colors beyond this list.

## Spacing

Follows an 8pt grid: `space-2` (8px), `space-4` (16px), `space-6` (24px), `space-8` (32px).

## Border Radius

Default: `rounded-md`. Use `rounded-full` only for pill/badge shapes.

## Typography

- Font stack: Hiragino Sans → Noto Sans JP → system sans-serif
- Page title: `text-5xl font-bold`
- Section heading: `text-2xl font-bold`
- Kana display (chart): `text-2xl font-medium`
- Kana display (quiz): `text-8xl font-medium`
- Caption / romaji: `text-xs text-muted-foreground`
- Body / labels: `text-sm`

## Responsive Design

The app targets both mobile and desktop using Tailwind's **mobile-first** breakpoints. Use the `sm:` prefix (≥ 640px) as the primary desktop breakpoint.

### Breakpoints

| Prefix | Min-width | Usage |
|---|---|---|
| *(none)* | 0px | Mobile base styles |
| `sm:` | 640px | Desktop / tablet overrides |

### Layout Containers

- Navbar inner container: `px-4 sm:px-8`, `gap-4 sm:gap-8`
- Page content: `px-4` (mobile padding, consistent across all pages)
- Max-width constraints: `max-w-sm` (quiz), `max-w-lg` (kana table) — these are unchanged across breakpoints

### Typography Scale

| Element | Mobile | Desktop |
|---|---|---|
| Page title | `text-3xl` | `sm:text-5xl` |
| Kana display (quiz) | `text-6xl` | `sm:text-8xl` |
| Kana display (chart) | `text-xl` | `sm:text-2xl` |

### Spacing Overrides

| Context | Mobile | Desktop |
|---|---|---|
| Page vertical padding | `py-6` | `sm:py-8` |
| Kana grid gap | `gap-1` | `sm:gap-2` |
| Kana grid row margin | `mb-1` | `sm:mb-2` |
| Kana cell padding | `py-2` | `sm:py-4` |
| Quiz content gap | `gap-6` | `sm:gap-8` |

---

## Navigation

- Navbar height: `h-14` (56px), sticky top
- Active nav item: `bg-secondary text-foreground`
- Inactive nav item: `text-muted-foreground hover:text-foreground hover:bg-secondary`
- Dropdown (desktop): `border border-border rounded-md shadow-md`, items use same active/inactive pattern
- **Mobile (`< sm`)**: Nav items are hidden; a hamburger button (`sm:hidden`) appears at the right edge. Tapping opens a flat menu below the navbar (`border-t border-border`). Menu closes automatically on route change.
