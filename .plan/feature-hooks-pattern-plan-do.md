# Refactor to Hooks Pattern Plan

## Overview
Refactor Start menu apps to use hooks pattern for better code organization

## Tasks

### To Do
- [ ] Create `src/hooks/` folder
- [ ] Create `hooks/useResume.ts` - state + actions for Resume
- [ ] Create `hooks/useEmail.ts` - state + actions for Email
- [ ] Update `module/start-module.ts` to import from hooks (for action + icon)
- [ ] Simplify Taskbar to use hooks
- [ ] Test & verify

### Done
- [x] Approved pattern design
- [x] Create `src/hooks/` folder
- [x] Create `hooks/useResume.ts` with state + actions
- [x] Create `hooks/useEmail.ts` with state + actions
- [x] Update `module/start-module.ts` to config only
- [x] Simplify Taskbar to use hooks
- [x] Test & verify
