# Style Guide

## CSS Structure

- Global: `src/style/index.css`
- Component: co-located in `style/` folder

## 98.css Integration

Import in main entry:
```tsx
import "98.css";
```

## Common Patterns

### Window
```tsx
<div class="window">
  <div class="title-bar">
    <div class="title-bar-text">Title</div>
    <div class="title-bar-controls">
      <button aria-label="Minimize"></button>
      <button aria-label="Maximize"></button>
      <button aria-label="Close"></button>
    </div>
  </div>
  <div class="window-body">
    Content here
  </div>
</div>
```

### Button
```tsx
<button class="default">Action</button>
```

### Input Field
```tsx
<fieldset>
  <legend>Label</legend>
  <div class="field-row">
    <input type="text" />
  </div>
</fieldset>
```

## Custom CSS Priority

Custom CSS in `style/` folder overrides 98.css defaults.
