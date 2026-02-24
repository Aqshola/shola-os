# shola-os Agent Guidelines

## Project Overview

- **Name:** shola-os (Aqshol Porto)
- **Type:** Portfolio Webapp
- **Tech:** SolidJS + Vite + TypeScript
- **Theme:** Windows 98 Retro Style

## Tech Stack

- **Framework:** SolidJS 1.9+
- **Build:** Vite 7.x
- **Routing:** @solidjs/router
- **Styling:** 98.css + custom CSS
- **Animation:** Framer Motion / Motion
- **Package Manager:** pnpm

## Project Structure

```
src/
├── apps/           # Reusable app components
│   ├── taskbar-app.ts
│   └── desktop-icon-app.ts
├── pages/          # Route pages (Desktop/)
│   └── Desktop/
│       ├── components/  # UI components
│       │   ├── taskbar.tsx
│       │   └── main.tsx
│       └── style/        # Component-specific CSS
├── style/          # Global styles
└── index.tsx      # Entry point
```

## Key Conventions

- **File extensions:** `.tsx` for components, `.ts` for logic
- **Styling:** CSS files co-located with components in `style/` folder
- **Routing:** @solidjs/router for page navigation

## Commands

```bash
pnpm dev     # Start dev server
pnpm build   # Production build
pnpm serve   # Preview production build
```

## Git Rules

- **ALWAYS create a feature branch** (`feature/<name>`) before making changes
- Use that branch for all development
- Commit with descriptive messages
- **Never commit to main/master directly**
- Merge via PR or delete branch after merge
