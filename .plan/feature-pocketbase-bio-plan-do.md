# PocketBase Bio Integration Plan

## Overview
Fetch bio from PocketBase bio collection and display in AboutMe window

## Bio Schema (PocketBase)
| Field | Type |
|-------|------|
| name | text |
| desc | editor (rich text) |

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create bio service in src/services/bio.ts
- [ ] Update useAboutMe hook to fetch bio from PocketBase
- [ ] Update AboutMeWindow to display dynamic data
- [ ] Test & verify
- [ ] Commit & push

## Files to Change
| File | Why |
|------|-----|
| src/services/bio.ts | Create getBio function |
| src/hooks/useAboutMe.ts | Add bio fetching |
| src/apps/AboutMeWindow.tsx | Display dynamic data using innerHTML for rich text |

**Note:** Use `innerHTML` to render `desc` field (rich text from editor)
