# Implement Alias Import Plan

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Add path alias `@/` to `tsconfig.json` → `src/`
- [ ] Configure `vite.config.ts` resolve.alias
- [ ] Update imports in files to use `@/hooks/`, `@/apps/`, etc.
- [ ] Test & verify

**Example:**
```typescript
// Before
import { useResume } from "../../../hooks/useResume";

// After
import { useResume } from "@/hooks/useResume";
```
