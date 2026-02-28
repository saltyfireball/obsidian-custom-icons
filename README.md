# Custom Icon Manager for Obsidian

![Old Meme](https://img.shields.io/badge/old%20meme-still%20funny%20to%20me-fff?style=flat&logo=reddit&logoColor=FFFFFF&label=old%20meme&labelColor=5B595C&color=FC9867) ![AOL](https://img.shields.io/badge/aol-3%20buddies%20online-fff?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgNDggNDgiIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTguMjA5IDQwLjg2TDQuNSA0MC44MzZsMTkuNTYtMzMuNzRsNS40ODMgOS41MzZtNS4wMDIgOC43TDQzLjUgNDAuOTA1aDBsLTE2LjQwMS0uMDNtNi45My0xNi40NGwuNTE2Ljg5N20tLjUxMy0uODk5Yy4wMDcgMi4wOTQtLjYwMiA0LjQxLTEuODYgNi41ODhoMGMtMS4yNDIgMi4xNTMtMi45OSAzLjkyMS00LjkzIDQuOTkyYy0yLjQxOSAxLjMzMy00LjkxOCAxLjQ2NS02LjgzMi4zNmMtMS4wNjItLjYxNC0xLjg2LTEuNTQ5LTIuMzgtMi42OTJjLTEuMjQtMi43MjQtLjkxMy02LjYyOCAxLjEzMy0xMC4xN2MuNDA3LS43MDcuODczLTEuMzc4IDEuMzg2LTEuOTk4bS02LjA2MSAxNS4xNDJjLTEuMjM1LTIuNzIzLS45MDYtNi42MjMgMS4xMzctMTAuMTYxYzEuMjQyLTIuMTUyIDIuOTg4LTMuOTIgNC45MjktNC45OWMyLjQxOC0xLjMzNSA0LjkxOC0xLjQ2NyA2LjgzNC0uMzYyYzEuMDYyLjYxNCAxLjg1OSAxLjU0OSAyLjM4IDIuNjkyYzEuMjQgMi43MjQuOTEyIDYuNjI4LTEuMTMzIDEwLjE3aDBhMTQuNTUzIDE0LjU1MyAwIDAgMS0xLjM5IDJtLTEyLjc0My42MzhjLTEuNDc2LTMuMDUtMS43NTMtNi45MDUtLjc2LTEwLjYwNmExNyAxNyAwIDAgMSAxLjg2OS00LjQwM20wIDBjLjA4NC0uMTM4LjE3LS4yNzQuMjU2LS40MW0wIDBjMi44ODEtNC40NDQgNy40My02LjYyNCAxMS41My01LjUyNWMuNzUzLjIwMiAxLjQ3NS41MSAyLjE1Mi45Mm00Ljk5NyA4LjcxM2MuMjIzIDIuMDA4LjA1NSA0LjExNC0uNDkgNi4xNDhoMGMtMS4xMTIgNC4xNTItMy42OTQgNy42NDQtNi45NTMgOS40MDltLTguODk4LS4wMTdjLTEuNTQ2LS45NDktMi44Mi0yLjQwNC0zLjcwMy00LjIzIi8+PC9zdmc+&label=AOL&labelColor=5B595C&color=FC9867) ![Silly Goose](https://img.shields.io/badge/silly%20goose-certified-fff?style=flat&logo=go&logoColor=FFFFFF&label=silly%20goose&labelColor=5B595C&color=5C7CFA) ![Logging](https://img.shields.io/badge/logging-console.log%20go%20brrr-fff?style=flat&logo=papertrail&logoColor=FFFFFF&label=logging&labelColor=5B595C&color=FFD866) ![Webcam](https://img.shields.io/badge/webcam-covered%20with%20sticker-fff?style=flat&logo=logitech&logoColor=FFFFFF&label=webcam&labelColor=5B595C&color=FC9867) ![Stackoverflow](https://img.shields.io/badge/stackoverflow-marked%20as%20duplicate-fff?style=flat&logo=stackoverflow&logoColor=FFFFFF&label=stackoverflow&labelColor=5B595C&color=A9DC76) ![Fridge](https://img.shields.io/badge/fridge-runs%20linux-fff?style=flat&logo=linux&logoColor=FFFFFF&label=fridge&labelColor=5B595C&color=A9DC76) ![Ctrl S](https://img.shields.io/badge/ctrl%20s-ritual%20spam-fff?style=flat&logo=windows&logoColor=FFFFFF&label=ctrl%20s&labelColor=5B595C&color=A9DC76) ![Stretch Goal](https://img.shields.io/badge/stretch%20goal-touch%20toes-fff?style=flat&logo=fitbit&logoColor=FFFFFF&label=stretch%20goal&labelColor=5B595C&color=FFD866)

Manage a custom icon library for use across Obsidian plugins. Upload SVG, PNG, or other image files and make them available as CSS variables and a global JavaScript API.

## Features

- **Icon Library Management** - Add, edit, and delete custom icons from the settings tab
- **SVG and Image Support** - Upload SVG (monochrome or colored), PNG, JPG, GIF, and WebP icons
- **CSS Variable Injection** - Icons are exposed as `:root` CSS variables (`--sf-icon-{id}`) for use in themes and snippets
- **Global API** - Exposes `window.SFIconManager` for programmatic access by other plugins
- **Search and Filter** - Quickly find icons by name or ID
- **Live Preview** - See how icons will render before saving

## How It Works

### CSS Variables

Each icon is injected as a CSS custom property on `:root`:

```css
:root {
    --sf-icon-python: url("data:image/svg+xml;base64,...");
    --sf-icon-folder-blue: url("data:image/png;base64,...");
}
```

Use these in your CSS snippets or themes:

```css
.my-element::before {
    -webkit-mask-image: var(--sf-icon-python);
    mask-image: var(--sf-icon-python);
    background-color: currentColor;
}
```

### Global API

Other plugins can access icons programmatically:

```typescript
// Check if Icon Manager is available
if (window.SFIconManager) {
    // Get all icons
    const icons = window.SFIconManager.getIcons();

    // Get a specific icon
    const icon = window.SFIconManager.getIconById("python");

    // Listen for changes
    const unsubscribe = window.SFIconManager.onIconsChanged(() => {
        console.log("Icons updated!");
    });

    // Later: stop listening
    unsubscribe();
}
```

## Adding Icons

1. Open Settings > Custom Icon Manager
2. Click "+ Add Icon"
3. Choose a unique ID (e.g., `python`, `my-logo`)
4. Upload an image file or paste a data URL
5. Toggle "Full Color Icon" for colored images (PNG, colored SVG)
6. Adjust size and border radius as needed
7. Click Save

## Icon Types

- **Monochrome** (default) - Icon color is controlled by CSS. Best for SVG icons that should adapt to the theme.
- **Full Color** - Icon renders with its original colors. Best for logos, badges, and colored images.

## Data Migration

If migrating from the SFB v2 main plugin, copy your icons:

```bash
jq '{icons: .icons}' \
  "/path/to/vault/.obsidian/plugins/sfb/data.json" \
  > "/path/to/vault/.obsidian/plugins/custom-icons/data.json"
```

## Compatibility

- Obsidian 1.0.0+
- Works on desktop and mobile
