export interface IconDefinition {
	id: string;
	name?: string;
	dataUrl: string;
	isColored?: boolean;
	backgroundSize?: string;
	borderRadius?: string;
}

export interface SFIconManagerAPI {
	getIcons(): IconDefinition[];
	getIconById(id: string): IconDefinition | null;
	onIconsChanged(callback: () => void): () => void;
}

export interface IconManagerSettings {
	icons: IconDefinition[];
}

export const DEFAULT_SETTINGS: IconManagerSettings = {
	icons: [],
};
