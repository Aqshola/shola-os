# Fix PR #8 Issues Plan

## Issues to Fix

### 1. PortfolioWindow - Register window in store
- File: `src/apps/PortfolioWindow.tsx` (lines 26-28)
- Problem: `bringToFront` and `getZIndex` used without registering window
- Fix: Register window on mount, unregister on unmount using `registerWindow` from store

### 2. useDraggable - Left mouse button only
- File: `src/hooks/useDraggable.ts` (lines 13-16)
- Problem: Drag starts on any mouse button
- Fix: Check `e.button === 0` (left button) before starting drag

### 3. useDraggable - Window blur cleanup
- File: `src/hooks/useDraggable.ts` (lines 30-37)
- Problem: Drag sticks if mouse released outside window
- Fix: Add window "blur" listener that calls cleanup handler

### 4. taskbar.tsx - Fragile Portfolio check
- File: `src/pages/Desktop/components/taskbar.tsx` (lines 109-128)
- Problem: Uses `app.title === "Portfolio"` (fragile), missing `onRestore` prop
- Fix: Add `id` field to StartApp interface, use `app.id === "portfolio"`, pass `onRestore`

### 5. windowStore.ts - Z-index tie issue
- File: `src/stores/windowStore.ts` (lines 13-16)
- Problem: Unknown windows and first ordered window both get z-index 10000
- Fix: Known windows get base 10001+, unknown get 10000

## Tasks

### To Do
- [ ] Create fix branch
- [ ] Fix PortfolioWindow registration
- [ ] Fix useDraggable left button check
- [ ] Fix useDraggable blur cleanup
- [ ] Add id to StartApp, fix taskbar conditional
- [ ] Fix getZIndex base values
- [ ] Add minimize/maximize to Portfolio window (like Resume/Email)
- [ ] Test & verify
