import {LAYERS, SOURCES} from "../main.js";

export const
	// Loaded texture list (images)
	TEXTURES = {},
	/**
	 * Load each texture into an image using the source array and store it into the texture list.
	 * @param	{function}	callback	The function to be called when all textures are loaded
	 */
	load_textures = callback => {
		// Get rid of duplicate sources
		let sources = [...new Set(SOURCES)],
			sources_length = sources.length,
			i = 0;

		// Load once each texture into an image
		for (let s of sources) {
			if (!(s in TEXTURES)) {
				TEXTURES[s] = new Image();
				TEXTURES[s].addEventListener("load", () => {
					// Run the callback function when all textures are loaded
					++i === sources_length && callback();
				});
				TEXTURES[s].src = `assets/textures/${s}`;
			}
		}
	};