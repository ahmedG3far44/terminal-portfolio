---
name: Terminal Portfolio
description: A terminal-themed portfolio platform with dynamic GitHub sync, bilingual RTL, and multi-theme support
colors:
  neutral-bg: "#0a0a0a"
  neutral-surface: "#141414"
  neutral-card: "#09090b"
  neutral-border: "#1e1e24"
  neutral-border-light: "#27272a"
  neutral-text: "#f5f5f5"
  neutral-text-muted: "#888888"
  accent: "#e63946"
  accent-secondary: "#457b9d"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  "2xl": "1.25rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "3rem"
  "3xl": "6rem"
components:
  button-primary:
    backgroundColor: "#ffffff"
    textColor: "#000000"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
    fontWeight: 600
  button-secondary:
    backgroundColor: "#141414"
    textColor: "#d4d4d8"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
    fontWeight: 500
  card-default:
    backgroundColor: "#09090b"
    textColor: "#f5f5f5"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
    borderColor: "#1e1e24"
  input-terminal:
    backgroundColor: "transparent"
    textColor: "#f5f5f5"
    rounded: "{rounded.sm}"
    padding: "0.5rem"
    fontFamily: "JetBrains Mono, monospace"
  nav-link:
    textColor: "#a1a1aa"
    rounded: "{rounded.sm}"
    padding: "0.25rem 0"
    fontFamily: "Inter, system-ui, sans-serif"
---

# Design System: Terminal Portfolio

## 1. Overview

**Creative North Star: "The Terminal Console"**

A dark-first, developer-oriented visual system that treats the terminal emulator as both metaphor and layout engine. Surfaces are flat and deliberate — zinc-950 is the canvas, white text reads as command output, and accent colors (drawn dynamically from a MongoDB theme system) provide the only chromatic relief. Borders do the work of shadows. Every element earns its place through typographic hierarchy and generous whitespace, not decoration.

The system explicitly rejects SaaS landing-page cliches: no hero-metric grids, no gradient text, no glassmorphism, no icon-on-card templates. The terminal is not a costume — it's a design constraint that produces clarity.

**Key Characteristics:**
- Dark-by-default, driven by a scene sentence (developer on a dimly-lit desk at night, focused on craft)
- Flat surfaces with border-based separation (no drop shadows)
- Typography as the primary carrier of hierarchy (Inter for headings, JetBrains Mono for code/UI)
- Dynamic accent colors from DB themes applied to borders, text highlights, and small UI elements
- Bilingual (English/Arabic RTL) as a first-class layout concern

## 2. Colors

The palette is zinc-heavy with one dynamic accent hue applied at low saturation. The accent is never the surface — it's the signal.

### Primary (Dynamic)
- **Dynamic Accent** (variable, DB-driven): Applied to CTAs, active tab indicators, bordered elements in hover state, and the terminal's glow effect. Typical seed values: green (#22c55e), purple (#a855f7), amber (#f59e0b), cyan (#06b6d4), white (#ffffff). Chroma is kept moderate; high-chroma extremes are avoided.

### Neutral
- **Canvas** (#09090b / zinc-950): Primary background. All surfaces sit on this.
- **Surface** (#141414 / zinc-900): Secondary background for cards, terminals, and inset areas.
- **Border Base** (#1e1e24 / zinc-850): Default stroke for cards and containers.
- **Border Subtle** (#27272a / zinc-800): Secondary strokes, dividers, input borders.
- **Text Primary** (#fafafa / zinc-50): Body and heading color on dark surfaces.
- **Text Muted** (#a1a1aa / zinc-400): Secondary information, labels, footers.
- **Text Dim** (#52525b / zinc-600): Placeholder text, disabled states.

### Named Rules
**The One-Accent Rule.** The accent color covers ≤10% of any screen. Its rarity is deliberate — it draws attention to interactive elements only.

## 3. Typography

**Display Font:** Inter (system-ui, sans-serif fallback)
**Body Font:** Inter (-apple-system, BlinkMacSystemFont, sans-serif)
**Mono Font:** JetBrains Mono (monospace fallback)

**Character:** Clean, precise, architectural. Inter's moderate x-height and tight letter-spacing at display weights convey engineering confidence. JetBrains Mono reads as code-native without being caricature. The pairing avoids serif editorialism and gamer-adjacent display faces equally.

### Hierarchy
- **Display** (800, clamp(2.25rem, 5vw, 3.5rem), 1.05, -0.02em): Hero headlines only. Single use per viewport.
- **Heading** (700, clamp(1.5rem, 3vw, 2rem), 1.15): Section titles.
- **Body** (400, 1rem, 1.6): Main content. Line length capped at 65–75ch.
- **Mono** (400, 0.875rem, 1.5): Terminal output, code blocks, command inputs. Always on dark backgrounds.
- **Label** (600, 0.75rem, 0.05em uppercase): Navigation links, section badges, form labels.

### Named Rules
**The One-Family Rule.** Inter covers display, heading, and body. A single-family approach with weight contrast (400 vs. 800) creates stronger hierarchy than timid face-pairing. Mono is the only departure, justified by the terminal metaphor.

## 4. Elevation

Pure flat system. Depth is communicated entirely through borders — zinc-850 for surfaces on zinc-950 canvas. No box-shadows anywhere in the base system. The only exception is the terminal widget's ambient glow, a radial gradient driven by the current accent color at very low opacity (≤12%), creating a subtle halo.

### Named Rules
**The Flat-At-Rest Rule. No shadows at rest. Hover states use border color shifts (zinc-850 → zinc-700), not elevation lifts.**

## 5. Components

### Buttons
- **Shape:** Moderately curved corners (0.5rem).
- **Primary:** White background, black text, 0.75rem 1.5rem padding. Hover transitions background to zinc-200. Carries `font-weight: 600`.
- **Secondary:** Zinc-900 background, zinc-300 text, 1px zinc-800 border. Hover brightens background to zinc-800/80 and text to white.
- **State transitions:** 150ms ease, color-only.

### Terminal Widget
- **Shape:** Rounded-2xl corners (1.25rem), zinc-950 background, zinc-800/80 border.
- **Title bar:** Zinc-900 background, three macOS-style dots (red/amber/green), centered connection label in JetBrains Mono.
- **Tab bar:** Zinc-900/50 background, text-zinc-500, active tab uses terminal theme's accent color for bottom border.
- **Body:** JetBrains Mono at 0.875rem, zinc-300/400 text for output lines, emerald-400 for success states, amber-400 for warnings.
- **Input:** Transparent background, zinc-100 text, zinc-700 placeholder. No border — separated by its parent container's border.
- **Command chips:** zinc-950 background, 1px zinc-800 border, hover shifts border to zinc-700.

### Cards / Containers
- **Corner Style:** Rounded-xl (1rem).
- **Background:** Zinc-950.
- **Border:** 1px solid zinc-900, hover shifts to zinc-850/80 with 350ms transition.
- **Shadow Strategy:** None. Flat at rest, flat on hover.
- **Internal Padding:** 1.5rem (small cards), 1.5rem–2rem (bento cards).

### Chips / Badges
- **Style:** Rounded background (zinc-900/60), 1px border (zinc-800), text at 0.75rem.
- **Variants:** Outline (zinc-900 background), success (emerald-950/50 bg, emerald-400 text), accent (theme color border/text).

### Navigation
- **Style:** Text links in JetBrains Mono (in the header) or Inter (section nav). Muted zinc-400 at rest, white on hover.
- **Active indicator:** 1.5px bottom underline that grows from 0 to 100% width on hover (300ms ease-out).

### FAQ Accordion
- **Container:** 1px zinc-900 border, zinc-950/60 background, rounded-xl overflow hidden.
- **Open state:** Background shifts to zinc-900/10 on the content area. Chevron rotates 180deg on expansion (300ms).
- **Motion:** Height animated via Framer Motion's AnimatePresence.

## 6. Do's and Don'ts

### Do:
- **Do** use zinc-dominated backgrounds (950, 900) with white/zinc-100 text.
- **Do** apply accent color sparingly — active tabs, borders on hover, terminal glow.
- **Do** use JetBrains Mono for any element that looks or acts like a terminal (code blocks, command inputs, connection labels).
- **Do** keep cards flat with border-only separation and hover border shifts.
- **Do** wrap every text section in 65–75ch max-width for readability.
- **Do** vary spacing between sections (py-16, py-24, py-32) for rhythm.
- **Do** use the terminal widget as the primary interactive showcase element — it demonstrates the product by being the product.

### Don't:
- **Don't** use hero-metric templates (big number, small label, supporting stat). SaaS cliche.
- **Don't** apply gradient text (`background-clip: text` with gradient). Use single solid color.
- **Don't** use glassmorphism (backdrop-blur as decorative surface treatment).
- **Don't** use side-stripe borders (>1px left/right border as accent on cards).
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** default to editorial-typographic aesthetics (display serif, italic drop caps, ruled separators) on a developer tools brief.
- **Don't** use monospace as lazy shorthand for "developer." It's justified here by the terminal metaphor, but every mono element should serve a functional purpose.
- **Don't** use AI-generated copy — avoid "supercharge," "game-changing," "revolutionary," and restated headings.
- **Don't** use em dashes. Use commas, colons, semicolons, or periods.
- **Don't** truncate or abbreviate Arabic text; RTL text needs the same care as LTR.
