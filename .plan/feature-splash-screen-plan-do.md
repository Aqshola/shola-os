# Splash Screen + Shutdown Plan

## Overview
Implement Windows 98-style splash screen and shutdown functionality

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create SplashScreen component (Windows 98 style)
- [ ] Create SplashScreen CSS
- [ ] Add state to show/hide splash screen
- [ ] Integrate into App entry point
- [ ] Add Shutdown/Restart to Start menu
- [ ] Shutdown: closes the browser tab
- [ ] Restart: placeholder for now
- [ ] Test & verify

## Design
```
┌─────────────────────────────────────────┐
│  [Windows 98 Logo]                      │
│   Microsoft Windows® 98                   │
│                                          │
│  ████████████░░░░░░░░░ (progress bar)   │
│                                          │
│  ▌ Detecting hardware...                │
└─────────────────────────────────────────┘
```

## Messages (typing effect)
- "Detecting hardware..."
- "Loading Windows 98..."
- "Starting desktop..."
- "Starting Windows..."

## Behavior
- Shows on app load
- Progress bar fills randomly
- Messages type out one by one
- After completion, fades out to show desktop
