# Redesign Portfolio Windows Plan

## Overview
Change Portfolio window to card-based list, redesign content window

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Update portfolio data to include thumbnail/screenshot URLs
- [ ] Redesign PortfolioWindow: card-based list (icon, title, thumbnail)
- [ ] Redesign PortfolioContentWindow: icon, title, buttons, screenshot, article with white bg
- [ ] Add CSS for new card styles
- [ ] Test & verify

## New Designs

### Portfolio Window (Card List)
```
┌─────────────────────────────────┐
│ [icon] Project Title            │
│ ┌─────────────────────────────┐  │
│ │     Screenshot/Thumbnail   │  │
│ └─────────────────────────────┘  │
└─────────────────────────────────┘
```

### Portfolio Content Window
```
┌─────────────────────────────────┐
│ [icon] Project Title            │
├─────────────────────────────────┤
│ [View Repo] [View Demo]        │
│ ┌─────────────────────────────┐  │
│ │      Screenshot            │  │
│ └─────────────────────────────┘  │
│ ┌─────────────────────────────┐  │
│ │ Description (white bg)     │  │
│ └─────────────────────────────┘  │
└─────────────────────────────────┘
```

## Data Update
Need to add thumbnail URLs to portfolioData.ts
