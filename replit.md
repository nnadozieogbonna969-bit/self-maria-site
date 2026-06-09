# Self-Maria — Interview Mastery

A premium, multi-page static landing site for **Self-Maria**, an interview coaching brand for professionals with 3+ years of experience.

## Brand
- **Name:** Self-Maria
- **Primary color:** `#005B5B` (deep teal)
- **Accent palette:** beige `#D4B48A`, cream `#F5EFDE`, sage teal `#4A9A98`
- **Logo:** `assets/logo.jpeg` (used in nav, footer, and favicon)
- **Typography:** Fraunces (serif headlines) + Inter (body)

## Pages
All pages live at the project root and share a single `style.css` and `script.js`.

| File | Purpose |
|---|---|
| `index.html` | Home — hero, pain points, course preview, stats, CTA |
| `about.html` | Story & values |
| `course.html` | Curriculum accordion + FAQ |
| `success.html` | Testimonials & stats |
| `enroll.html` | Lead magnet form + full course CTA |

## Shared layout
- **Right-side fixed navigation** (`.sidenav`) — rendered by `script.js` on every page so each HTML file only contains page-specific content.
- **Announcement bar** with countdown timer + seat counter (urgency).
- **Footer** is included in each HTML file directly.
- Mobile: side nav collapses behind a hamburger button (top-right).

## Integrations (placeholders only — to be filled in by client)
1. **ConvertKit form** — search for `CONVERTKIT FORM PLACEHOLDER` in `enroll.html`. Replace the entire `<form>` block with the ConvertKit embed code.
2. **Selar.com product link** — search for `SELAR.COM PRODUCT LINK PLACEHOLDER` in `enroll.html`. Replace `href="#"` with the Selar product URL.

## JS features (`script.js`)
- Auto-rendered shared nav, announcement bar, mobile toggle
- Page loader with brand mark
- Countdown timer (persists per-visitor in localStorage)
- Seat counter that gradually decreases
- Reveal-on-scroll (IntersectionObserver)
- Animated number counters (`data-count="4200"`)
- FAQ + curriculum accordions
- Magnetic button hover
- Cursor-follow aurora glow
- Parallax blob shapes in hero
- Lead form placeholder (replaced when ConvertKit embed is pasted)

## Serving
- Static files served by `static-web-server` on port 80.
- Workflow: `Serve static` (configured in `.replit`).
- Deployment: static, `publicDir = "/"`.
