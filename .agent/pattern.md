# Development Patterns

## General Rules

1. **Always read `.agent/agent.md` first** before working on this project
2. Use TypeScript — no `.js` files
3. Follow existing file structure and naming conventions
4. Run `pnpm dev` to verify changes work

## Code Style

- **Components:** Functional components with `.tsx` extension
- **CSS:** Co-locate in `style/` folder next to component
- **Imports:** Use clear, explicit imports (no default exports unless singleton)

## Git Workflow

- Create feature branch before making changes
- Commit with descriptive messages
- Never commit to main/master directly

## Adding New Features

1. Check `agent.md` for project structure
2. Identify where the feature fits (app vs page vs component)
3. Create necessary files following existing patterns
4. Test with `pnpm dev`

## Troubleshooting

- If build fails: check `tsconfig.json` and import paths
- Style issues: check 98.css classes vs custom CSS precedence
- Routing issues: verify routes in `@solidjs/router` setup
