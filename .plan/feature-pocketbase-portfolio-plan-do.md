# PocketBase Portfolio Integration Plan

## Overview
Integrate PocketBase to fetch portfolio data dynamically instead of using static data

## Current Structure
- `src/services/portofolio.ts` - Already has PocketBase service with getListPortofolio()
- `src/lib/pocketbase.ts` - PocketBase client initialized
- `src/data/portfolioData.ts` - Static data (to be replaced)

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Add getDetailPortofolio(id) function in services/portofolio.ts
- [ ] Update usePortfolio hook to fetch data from PocketBase
- [ ] Update PortfolioWindow to use dynamic data from PocketBase
- [ ] Update PortfolioContentWindow to use dynamic data from PocketBase
- [ ] Update .agent/pattern.md to document PocketBase service pattern
- [ ] Test & verify
- [ ] Commit & push

## Data Flow
1. PortfolioWindow mounts → calls getListPortofolio() → stores in signal
2. User clicks project → calls getDetailPortofolio(id) → opens content window
3. PortfolioContentWindow shows detail data

## PocketBase Service Pattern
- All API calls go through src/services/
- Initialize PocketBase in src/lib/pocketbase.ts
- Call initPocketBase() in app entry point
