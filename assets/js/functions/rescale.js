import {WINDOW, LAYERS, LAYER_VALUES} from "../main.js";

export let
	default_scale = 2, // Default GUI scale
	scale = default_scale, // Current GUI scale
	old_scale, // Previous GUI scale
	/**
	 * Resize the layers according to the window size and update the CSS --scale variable with the new scale.
	 */
	rescale = () => {
		// Store the new window dimensions
		WINDOW.W = Math.ceil(innerWidth / 2) * 2;
		WINDOW.H = Math.ceil(innerHeight / 2) * 2;

		// Reset the scale to default
		scale = default_scale;

		// Calculate the new scale
		let i = default_scale + 1;
		for (; i > 1; i--) {
			(WINDOW.W <= WINDOW.DW * i || WINDOW.H < WINDOW.DH * i) && (scale = i - 1);
		}

		if (scale !== old_scale) {
			// Update the old scale if it differs from the current one
			old_scale = scale;

			// Update CSS --scale
			document.documentElement.style.setProperty("--scale", `${scale}px`);
		}

		// Update display information in the debug menu
		LAYERS.debug.components.display.text = `Display: ${WINDOW.W}x${WINDOW.H}`;

		// Redraw layers
		for (let l of LAYER_VALUES) {l.resize()}
	};