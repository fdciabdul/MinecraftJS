import {LAYERS, SOURCES, TEXTURES} from "../main.js";

/**
 * Load component textures as HTML images into the texture array.
 * @param	{function}	callback	Callback function
 */
export const load_textures = callback => {
	// Get rid of duplicate sources
	const sources = [...new Set(SOURCES)], count = sources.length;

	// Load each texture into an image
	let i = 0;
	for (let s of sources) {
		TEXTURES[s] = new Image();
		TEXTURES[s].addEventListener("load", () => {
			// Run the callback when all textures are loaded
			++i === count && callback();
		});
		TEXTURES[s].src = `../../assets/textures/${s}`;
	}
};