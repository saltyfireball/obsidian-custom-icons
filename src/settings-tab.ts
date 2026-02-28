import { App, Modal, PluginSettingTab, Setting } from "obsidian";
import type IconManagerPlugin from "./main";
import { AddIconModal } from "./modals";

export class IconManagerSettingTab extends PluginSettingTab {
	plugin: IconManagerPlugin;

	constructor(app: App, plugin: IconManagerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass("sf-settings");

		;
		containerEl.createEl("p", {
			text: "Manage your icon library. Icons are exposed as CSS variables (--sf-icon-{id}) and via the window.SFIconManager API for other plugins to consume.",
			cls: "sf-hint",
		});

		const addIconBtn = containerEl.createEl("button", {
			text: "Add icon",
		});
		addIconBtn.addEventListener("click", () => {
			new AddIconModal(this.app, this.plugin).open();
		});

		const iconSearchInput = containerEl.createEl("input", {
			type: "text",
			placeholder: "Search icons by name or ID...",
			cls: "sf-icon-search",
		});

		const iconList = containerEl.createDiv("sf-icon-list");

		const renderIconList = (filter = "") => {
			iconList.empty();
			const filterLower = filter.toLowerCase();
			const sortedIcons = [...this.plugin.settings.icons].sort(
				(iconA, iconB) => {
					const nameA = (iconA.name || "").toLowerCase();
					const nameB = (iconB.name || "").toLowerCase();
					if (nameA < nameB) return -1;
					if (nameA > nameB) return 1;
					const idA = (iconA.id || "").toLowerCase();
					const idB = (iconB.id || "").toLowerCase();
					if (idA < idB) return -1;
					if (idA > idB) return 1;
					return 0;
				},
			);
			const filteredIcons = sortedIcons.filter((icon) => {
				const iconName = icon.name?.toLowerCase() ?? "";
				return (
					!filter ||
					iconName.includes(filterLower) ||
					icon.id.toLowerCase().includes(filterLower)
				);
			});

			if (filteredIcons.length === 0) {
				iconList.createEl("p", {
					text: filter
						? "No icons match your search."
						: 'No icons defined. Click "Add Icon" to add your first icon.',
					cls: "sf-empty-message",
				});
			} else {
				for (const icon of filteredIcons) {
					const item = iconList.createDiv("sf-icon-item");

					const preview = item.createDiv("sf-icon-item-preview");
					if (icon.isColored) {
						preview.addClass("sf-icon-colored");
						preview.setCssProps({
							"--sf-item-bg-image": icon.dataUrl,
						});
					} else {
						preview.addClass("sf-icon-mono");
						preview.setCssProps({
							"--sf-item-mask-image": icon.dataUrl,
						});
					}

					const info = item.createDiv("sf-icon-item-info");
					info.createEl("strong", { text: icon.name || icon.id });
					info.createEl("code", { text: icon.id });
					if (icon.isColored) {
						info.createEl("span", {
							text: "(colored)",
							cls: "sf-tag",
						});
					}

					const actions = item.createDiv("sf-icon-item-actions");

					const editBtn = actions.createEl("button", {
						text: "Edit",
					});
					editBtn.addEventListener("click", () => {
						new AddIconModal(this.app, this.plugin, icon).open();
					});

					const deleteBtn = actions.createEl("button", {
						text: "Delete",
						cls: "mod-warning",
					});
					deleteBtn.addEventListener("click", () => {
						new ConfirmModal(
							this.app,
							`Delete icon "${icon.name || icon.id}"?`,
							() => {
								this.plugin.settings.icons =
									this.plugin.settings.icons.filter(
										(i) => i.id !== icon.id,
									);
								void this.plugin.saveIconSettings().then(() => {
									this.display();
								});
							},
						).open();
					});
				}
			}
		};

		iconSearchInput.addEventListener("input", (event: Event) => {
			const target = event.target as HTMLInputElement;
			if (!target) return;
			renderIconList(target.value);
		});

		renderIconList();
	}
}

class ConfirmModal extends Modal {
	private resolved = false;
	constructor(app: App, private message: string, private onConfirm: () => void) {
		super(app);
	}
	onOpen() {
		this.contentEl.createEl("p", { text: this.message });
		new Setting(this.contentEl)
			.addButton(b => b.setButtonText("Confirm").setCta().onClick(() => { this.resolved = true; this.close(); this.onConfirm(); }))
			.addButton(b => b.setButtonText("Cancel").onClick(() => this.close()));
	}
	onClose() { this.contentEl.empty(); }
}
