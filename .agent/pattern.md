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

## PocketBase Integration

### Setup
- PocketBase client: `src/lib/pocketbase.ts`
- Initialize: Call `initPocketBase()` in app entry point

### Services
- All PocketBase API calls: `src/services/<name>.ts`
- Each service file handles one collection
- Functions: `getList<Name>()`, `getDetail<Name>(id)`, `create<Name>(data)`

### Data Flow
1. Hook fetches data from service
2. Component receives data via hook
3. Store state in hook (useXxx pattern)

### Example: Portfolio
```typescript
// src/services/portofolio.ts
import { pb } from "@/lib/pocketbase";

export async function getListPortofolio() {
  return await pb.collection('portofolio').getFullList();
}

export async function getDetailPortofolio(id: string) {
  return await pb.collection('portofolio').getOne(id);
}

// src/hooks/usePortfolio.ts
import { createSignal } from "solid-js";
import { getListPortofolio, getDetailPortofolio } from "@/services/portofolio";

export function usePortfolio() {
  const [projects, setProjects] = createSignal([]);
  
  const fetchProjects = async () => {
    const data = await getListPortofolio();
    setProjects(data);
  };
  
  return { projects, fetchProjects, ... };
}
```

### Pattern for New Features with PocketBase
1. Create service function in `src/services/<collection>.ts`
2. Add data fetching to appropriate hook
3. Update component to use dynamic data
