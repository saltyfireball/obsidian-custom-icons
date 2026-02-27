import { Plugin } from "obsidian";
import type {
	IconDefinition,
	IconManagerSettings,
	SFIconManagerAPI,
} from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { IconManagerSettingTab } from "./settings-tab";

declare global {
	interface Window {
		SFIconManager?: SFIconManagerAPI;
	}
}

export default class IconManagerPlugin extends Plugin {
	settings: IconManagerSettings = DEFAULT_SETTINGS;
	private styleEl: HTMLStyleElement | null = null;
	private changeCallbacks: Set<() => void> = new Set();

	async onload() {
		await this.loadSettings();

		// Inject CSS variables for icons (must be dynamic - icon data URLs are user-defined at runtime)
		// eslint-disable-next-line obsidianmd/no-forbidden-elements -- dynamic CSS variables for user-uploaded icons cannot use static styles.css
		this.styleEl = document.createElement("style");
		this.styleEl.id = "sf-icon-manager-styles";
		document.head.appendChild(this.styleEl);
		this.updateIconCSS();

		// Expose global API
		window.SFIconManager = {
			getIcons: () => this.getIcons(),
			getIconById: (id: string) => this.getIconById(id),
			onIconsChanged: (callback: () => void) =>
				this.onIconsChanged(callback),
		};

		// Register settings tab
		this.addSettingTab(new IconManagerSettingTab(this.app, this));
	}

	onunload() {
		// Remove global API
		delete window.SFIconManager;

		// Remove style element
		if (this.styleEl) {
			this.styleEl.remove();
			this.styleEl = null;
		}

		// Clear change callbacks
		this.changeCallbacks.clear();
	}

	getIcons(): IconDefinition[] {
		return [...this.settings.icons];
	}

	getIconById(id: string): IconDefinition | null {
		return this.settings.icons.find((icon) => icon.id === id) ?? null;
	}

	onIconsChanged(callback: () => void): () => void {
		this.changeCallbacks.add(callback);
		return () => {
			this.changeCallbacks.delete(callback);
		};
	}

	private notifyIconsChanged(): void {
		for (const callback of this.changeCallbacks) {
			try {
				callback();
			} catch (e) {
				console.error("SFIconManager: error in change callback", e);
			}
		}
	}

	updateIconCSS(): void {
		if (!this.styleEl) return;

		const lines: string[] = [];
		lines.push(":root {");
		for (const icon of this.settings.icons) {
			lines.push(`  --sf-icon-${icon.id}: ${icon.dataUrl};`);
		}
		lines.push("}");

		this.styleEl.textContent = lines.join("\n");
	}

	async loadSettings() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- loadData returns any
		const savedData = await this.loadData();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- merging with loadData result
		this.settings = Object.assign({}, DEFAULT_SETTINGS, savedData || {});
		if (!Array.isArray(this.settings.icons)) {
			this.settings.icons = [];
		}
	}

	async saveIconSettings() {
		await this.saveData(this.settings);
		this.updateIconCSS();
		this.notifyIconsChanged();
	}
}
