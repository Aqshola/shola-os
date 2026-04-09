# Deep Link App Plan

## Overview
Add query param support to auto-open apps and update URL

## Features

### URL-Based App Opening
- Read `app_name` query param on load
- Auto-open app if param exists
- Update URL when opening apps

### Example
- URL: `?app_name=resume` → auto opens Resume window
- Click Resume in Start menu → URL changes to `?app_name=resume`

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Read app_name param on app init
- [ ] Auto-open app if param exists
- [ ] Update URL when opening apps
- [ ] Test & verify
- [ ] Commit & push