import {__debug, WINDOW, LAYERS} from "../main.js";

/**
 * Resize the layers and the CSS elements according to the window size.
 */
export const rescale = () => {
	// Store the new window dimensions
	WINDOW.W = Math.ceil(innerWidth / 2) * 2;
	WINDOW.H = Math.ceil(innerHeight / 2) * 2;

	// Reset the scale to default
	scale = default_scale;

	// Calculate the new scale
	if (__debug.force_max_scale) {
		let i = default_scale + 2;
		while (--i > 1) {
			(WINDOW.W <= WINDOW.DW * i || WINDOW.H < WINDOW.DH * i) && (scale = i - 1);
		}
	}

	if (scale !== old_scale) {
		// Update the old scale if it differs from the current one
		old_scale = scale;

		// Update CSS --scale
		document.documentElement.style.setProperty("--scale", `${scale}px`);

		// Update layer components
		for (let l of LAYERS) {l.resize(true)}
	} else {
		// Redraw layer components without scale update
		for (let l of LAYERS) {l.resize()}
	}
};

export let
	// Default GUI scale (selected)
	default_scale = 4,
	// Current GUI scale (graphical)
	scale,
	// Previous GUI scale (graphical)
	old_scale;