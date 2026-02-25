# Draggable Windows Plan

## Tasks

### To Do
- [ ] Create feature branch
- [ ] Create `stores/windowStore.ts` with z-index management
- [ ] Create `hooks/useDraggable.ts` for drag logic
- [ ] Update window components (Resume, Email) to use drag + z-index
- [ ] Test & verify

## Implementation

### windowStore.ts
- Module-level store with window order
- `bringToFront(id)` - move window to top
- `getZIndex(id)` - get z-index based on order

### useDraggable.ts
- `onMouseDown` on title bar → start drag
- Track mouse movement → update position
- `onMouseUp` → stop drag
- Return: position {x, y}, handlers
