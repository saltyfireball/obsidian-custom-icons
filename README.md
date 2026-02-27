# Custom Icon Manager for Obsidian

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
