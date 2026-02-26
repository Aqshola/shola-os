# Portfolio App Feature Plan

## Overview
Create Portfolio app that shows folder grid, click to open project details in new window

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create portfolio data with projects (name, description, demoUrl, repoUrl)
- [ ] Create `usePortfolio` hook for window state
- [ ] Create `PortfolioWindow.tsx` - main window with folder grid
- [ ] Create `PortfolioContentWindow.tsx` - project details with links
- [ ] Add Portfolio to Start menu
- [ ] Test & verify

### Portfolio Data Structure
```typescript
const portfolioProjects = [
  {
    id: "terminal",
    name: "Terminal Portfolio",
    icon: "/assets/icons/terminal.ico",
    description: "Interactive terminal-style portfolio with commands",
    demoUrl: "https://portfolio-terminal-shola.netlify.app",
    repoUrl: "https://github.com/aqshol-claw/portfolio-terminal",
  },
  // more projects...
];
```

### Window Flow
1. Open Portfolio → shows folder grid
2. Click folder → opens new window with project details + links
