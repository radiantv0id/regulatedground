# Regulated Ground Website

Static site for Regulated Ground (yoga therapy + kundalini adaptation in Bremen).

## Conventions

- Every HTML page must include the `LocalBusiness` JSON-LD block in `<head>`,
  identical to existing pages and anchored at `@id: "https://regulatedground.com/#business"`.
  It sits between the `twitter:image` meta and the `<link rel="stylesheet" href="/style.css">`.
- All pages share `style.css` and the inline `<style>body, .tinted { background: #EDE6D2; }</style>`.
- Subheadings under the page `<h1>` use `class="tagline"` (see style.css `.hero .tagline`).
- Shared nav/site nav classes: `header.site`, `footer.site`, `nav.main`. Copy an existing page's header/footer for new pages.

## Commands

- **"open website"** → run `cd "/home/nils/Documents/Regulated Ground/Website" && npm run dev`

## Verify

- Structured data is valid on every page:
  `grep -l application/ld\+json *.html`
- New pages must be added to `sitemap.xml` (never include `success.html`).
- If a page should not be indexed, block it in `robots.txt`.