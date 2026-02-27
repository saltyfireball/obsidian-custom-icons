import { Modal, Notice } from "obsidian";
import type { App } from "obsidian";
import type { IconDefinition } from "./types";
import type IconManagerPlugin from "./main";

type IconFormData = {
	id: string;
	name: string;
	dataUrl: string;
	isColored: boolean;
	backgroundSize: string;
	borderRadius: string;
};

export class AddIconModal extends Modal {
	plugin: IconManagerPlugin;
	existingIcon: IconDefinition | null;
	iconData: IconFormData;

	constructor(
		app: App,
		plugin: IconManagerPlugin,
		existingIcon: IconDefinition | null = null,
	) {
		super(app);
		this.plugin = plugin;
		this.existingIcon = existingIcon;
		this.iconData = existingIcon
			? {
					id: existingIcon.id || "",
					name: existingIcon.name || "",
					dataUrl: existingIcon.dataUrl || "",
					isColored: existingIcon.isColored || false,
					backgroundSize: existingIcon.backgroundSize || "",
					borderRadius: existingIcon.borderRadius || "",
				}
			: {
					id: "",
					name: "",
					dataUrl: "",
					isColored: false,
					backgroundSize: "",
					borderRadius: "",
				};
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass("sf-add-icon-modal");

		contentEl.createEl("h2", {
			text: this.existingIcon ? "Edit Icon" : "Add Icon",
		});

		// ID field
		const idRow = contentEl.createDiv("sf-form-row");
		idRow.createEl("label", { text: "ID (unique identifier)" });
		const idInput = idRow.createEl("input", {
			type: "text",
			placeholder: "e.g., book, django, my-icon",
			value: this.iconData.id,
		});
		idInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			if (!target) return;
			this.iconData.id = target.value
				.toLowerCase()
				.replace(/[^a-z0-9-]/g, "-");
			target.value = this.iconData.id;
		});

		// Name field
		const nameRow = contentEl.createDiv("sf-form-row");
		nameRow.createEl("label", { text: "Display name" });
		const nameInput = nameRow.createEl("input", {
			type: "text",
			placeholder: "e.g., Book, Django Logo",
			value: this.iconData.name,
		});
		nameInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			if (!target) return;
			this.iconData.name = target.value;
		});

		// File upload
		const uploadRow = contentEl.createDiv("sf-form-row");
		uploadRow.createEl("label", { text: "Upload icon file" });
		const fileInput = uploadRow.createEl("input", {
			type: "file",
			attr: { accept: ".svg,.png,.jpg,.jpeg,.gif,.webp,image/*" },
		});
		fileInput.addEventListener("change", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			const file = target?.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (evt: ProgressEvent<FileReader>) => {
				const result = evt.target?.result;
				if (!result || typeof result !== "string") return;
				const urlValue = `url("${result}")`;
				this.iconData.dataUrl = urlValue;
				urlInput.value = urlValue;
				this.updatePreview(previewEl);

				// Auto-detect if colored based on file type
				if (
					file.type === "image/png" ||
					file.type === "image/jpeg" ||
					file.type === "image/gif" ||
					file.type === "image/webp"
				) {
					this.iconData.isColored = true;
					coloredToggle.checked = true;
					this.updatePreview(previewEl);
				}

				// Auto-fill ID and name from filename if empty
				if (!this.iconData.id) {
					const baseName = file.name
						.replace(/\.[^.]+$/, "")
						.toLowerCase()
						.replace(/[^a-z0-9-]/g, "-");
					this.iconData.id = baseName;
					idInput.value = baseName;
				}
				if (!this.iconData.name) {
					const baseName = file.name.replace(/\.[^.]+$/, "");
					this.iconData.name = baseName;
					nameInput.value = baseName;
				}
			};
			reader.readAsDataURL(file);
		});

		// Data URL field (manual entry)
		const urlRow = contentEl.createDiv("sf-form-row");
		urlRow.createEl("label", { text: "Or paste data URL" });
		const urlInput = urlRow.createEl("textarea", {
			placeholder:
				'url("data:image/svg+xml;base64,...") or data:image/svg+xml;base64,...',
		});
		urlInput.value = this.iconData.dataUrl;
		urlInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLTextAreaElement | null;
			if (!target) return;
			let value = target.value.trim();
			if (value.startsWith("data:") && !value.startsWith("url(")) {
				value = `url("${value}")`;
			}
			this.iconData.dataUrl = value;
			this.updatePreview(previewEl);
		});

		// Is Colored toggle
		const coloredRow = contentEl.createDiv("sf-form-row sf-toggle-row");
		coloredRow.createEl("label", { text: "Full color icon" });
		const coloredToggle = coloredRow.createEl("input", {
			type: "checkbox",
		});
		coloredToggle.checked = this.iconData.isColored;
		coloredToggle.addEventListener("change", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			if (!target) return;
			this.iconData.isColored = target.checked;
			this.updatePreview(previewEl);
		});
		coloredRow.createEl("span", {
			text: "Enable for colored icons (PNG, colored SVG), disable for monochrome icons",
			cls: "sf-hint",
		});

		// Background Size
		const bgSizeRow = contentEl.createDiv("sf-form-row");
		bgSizeRow.createEl("label", { text: "Icon size (optional)" });
		const bgSizeInput = bgSizeRow.createEl("input", {
			type: "text",
			placeholder: "e.g., 120% (zoom in), 90% (smaller), 70%",
			value: this.iconData.backgroundSize || "",
		});
		bgSizeRow.createEl("span", {
			text: "100% = full size, 120% = zoomed/larger, 80% = smaller with padding",
			cls: "sf-hint",
		});
		bgSizeInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			if (!target) return;
			this.iconData.backgroundSize = target.value.trim();
			this.updatePreview(previewEl);
		});

		// Border Radius (colored icons only)
		const borderRadiusRow = contentEl.createDiv("sf-form-row");
		borderRadiusRow.createEl("label", {
			text: "Border radius (colored icons)",
		});
		const borderRadiusInput = borderRadiusRow.createEl("input", {
			type: "text",
			placeholder: "e.g., 3px, 50% for circle",
			value: this.iconData.borderRadius || "",
		});
		borderRadiusRow.createEl("span", {
			text: "Rounds corners of colored icons. Has no effect on monochrome icons.",
			cls: "sf-hint",
		});
		borderRadiusInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLInputElement | null;
			if (!target) return;
			this.iconData.borderRadius = target.value.trim();
			this.updatePreview(previewEl);
		});

		// Preview
		const previewRow = contentEl.createDiv("sf-form-row");
		previewRow.createEl("label", { text: "Preview" });
		const previewEl = previewRow.createDiv("sf-icon-preview-large");
		this.updatePreview(previewEl);

		// Actions
		const actions = contentEl.createDiv("sf-modal-actions");

		const saveBtn = actions.createEl("button", {
			text: "Save",
			cls: "mod-cta",
		});
		saveBtn.addEventListener("click", () => { void this.save(); });

		const cancelBtn = actions.createEl("button", { text: "Cancel" });
		cancelBtn.addEventListener("click", () => this.close());
	}

	updatePreview(previewEl: HTMLElement): void {
		previewEl.empty();
		if (!this.iconData.dataUrl) {
			previewEl.setText("No preview");
			return;
		}

		const preview = previewEl.createDiv("sf-preview-icon");

		let bgSize = this.iconData.backgroundSize || "contain";
		if (bgSize && /^\d+$/.test(bgSize)) {
			bgSize = bgSize + "%";
		}

		let borderRadius = this.iconData.borderRadius || "";
		if (borderRadius && /^\d+$/.test(borderRadius)) {
			borderRadius = borderRadius + "px";
		}

		if (this.iconData.isColored) {
			preview.addClass("sf-preview-colored");
			preview.setCssProps({
				"--sf-preview-bg-image": this.iconData.dataUrl,
				"--sf-preview-bg-size": bgSize,
			});
		} else {
			preview.addClass("sf-preview-mono");
			preview.setCssProps({
				"--sf-preview-mask-image": this.iconData.dataUrl,
				"--sf-preview-mask-size": bgSize,
			});
		}

		if (borderRadius) {
			preview.addClass("sf-preview-rounded");
			preview.setCssProps({
				"--sf-preview-border-radius": borderRadius,
			});
		}
	}

	async save() {
		const existingIcon = this.existingIcon;
		if (!this.iconData.id) {
			new Notice("Icon ID is required");
			return;
		}
		if (!this.iconData.name) {
			this.iconData.name = this.iconData.id;
		}
		if (!this.iconData.dataUrl) {
			new Notice("Data URL is required");
			return;
		}

		if (!existingIcon) {
			const existing = this.plugin.settings.icons.find(
				(i) => i.id === this.iconData.id,
			);
			if (existing) {
				new Notice(`Icon with ID "${this.iconData.id}" already exists`);
				return;
			}
			this.plugin.settings.icons.push(this.iconData);
		} else {
			const idx = this.plugin.settings.icons.findIndex(
				(i) => i.id === existingIcon.id,
			);
			if (idx >= 0) {
				this.plugin.settings.icons[idx] = this.iconData;
			}
		}

		await this.plugin.saveIconSettings();
		this.close();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
