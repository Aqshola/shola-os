# PocketBase Email Integration Plan

## Overview
Add email submission to PocketBase when user clicks Send in Email window

## Email Schema (PocketBase)
| Field | Type |
|-------|------|
| sender | email |
| content | text |
| created | autodate |

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create email service in src/services/email.ts with sendEmail function
- [ ] Update EmailWindow to:
  - Call PocketBase on submit
  - Show success popup "Email sent!" on success
  - Show error popup on failure
- [ ] Test & verify
- [ ] Commit & push

## Files to Change
| File | Why |
|------|-----|
| src/services/email.ts | Create sendEmail function |
| src/apps/EmailWindow.tsx | Add submit handler + success/error popup |
