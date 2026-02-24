# Components Guide

## UI Components

### Taskbar
- **Location:** `src/pages/Desktop/components/taskbar.tsx`
- **Style:** `src/pages/Desktop/style/taskbar.css`
- **Features:** Start button, clock, window list

### Desktop Icons
- **Location:** `src/apps/desktop-icon-app.ts`
- **Usage:** Drag & drop enabled icons on desktop

### Windows
- **Style:** `src/pages/Desktop/style/window.css`
- **Theme:** 98.css window classes (`.window`, `.title-bar`, etc.)

## 98.css Components

| Class | Description |
|-------|-------------|
| `.window` | Main window container |
| `.title-bar` | Window title bar |
| `.title-bar-controls` | Close/minimize/maximize buttons |
| `.window-body` | Window content area |
| `.field-row` | Form field row |
| `.button` | Action buttons |

## Adding New Components

1. Create `src/components/<FeatureName>.tsx`
2. Add co-located `src/components/<FeatureName>/style.css`
3. Import and use in pages
