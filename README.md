# SkyXperts Website

Team website for SkyXperts (SUAS). Built with Next.js App Router and Tailwind CSS. Statically exported for GitHub Pages.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Static export to `out/`  |
| `npm run lint`  | Run ESLint               |

## Project structure

```
app/
  page.tsx              Homepage
  team/                 Team page
  vehicles/             Vehicles page
  gallery/              Gallery page
  build-log/            Build log page
  sponsorships/         Sponsorships page
  contact/              Contact page
  layout.tsx            Shared layout (Nav + Footer)
components/
  Nav.tsx
  Footer.tsx
```

Each route currently has a placeholder heading. Build your page content in the matching `app/<route>/page.tsx`.
