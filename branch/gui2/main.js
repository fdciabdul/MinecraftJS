import {Layer, LayerFragment} from "./class/Layer.js";
import {load_textures} from "./functions/load_textures.js";
import {scale, rescale} from "./functions/rescale.js";

export const
	// Debugging options
	__debug = {
		force_max_scale: false,
		debug_menu_enabled: true,
	},
	// Resource list (mostly JSON)
	RESOURCES = [
		"../../assets/font.json",
		"gui.json",
	],
	// Screen properties (sizes and current cursor position)
	WINDOW = {
		DW: 320,
		DH: 240,
		W: innerWidth,
		H: innerHeight,
		MW: screen.width,
		MH: screen.height,
		X: 0,
		Y: 0,
	},
	// Texture path list (set the preloaded textures here)
	SOURCES = ["font/ascii.png"],
	// Loaded texture list (images)
	TEXTURES = {};

export let
	// Layer list
	LAYERS,
	// Font data
	Font = {},
	// Color list
	Color,
	// Background color list
	BackgroundColor;

(() => {
	// Check for Fetch API browser compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch JSON resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Create layers
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;
			BackgroundColor = response[0].background_color;
			LAYERS = response[1].map(l => new Layer(l));

			document.body.appendChild(LayerFragment);

			load_textures(rescale);

			addEventListener("resize", rescale);
		})
		.catch(error => console.error(error));
})();