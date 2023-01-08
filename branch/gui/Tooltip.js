import {LAYERS, WINDOW, TEXTURES, Font, scale} from "./main.js";
import {Component} from "./Component.js";
import {compute_text} from "../../assets/js/functions/compute_text.js";

export const
	tooltip_elements = [],
	Tooltip = document.createElement("div");

Tooltip.id = "tooltip";
Tooltip.visible = 0;
Tooltip.canvas = document.createElement("canvas");
Tooltip.text = {};

Tooltip.toggle = (v = !Tooltip.visible) => {
	Tooltip.visible = Number(v);

	Tooltip.style.opacity = Tooltip.visible;
	Tooltip.canvas.style.opacity = Tooltip.visible;
};

Tooltip.init = () => {
	Tooltip.canvas.width = WINDOW.MW;
	Tooltip.canvas.height = WINDOW.MH;

	Tooltip.ctx = Tooltip.canvas.getContext("2d");
	Tooltip.ctx.imageSmoothingEnabled = false;

	// For each layer, get the list of components which use a tooltip
	for (let l of LAYERS) {
		// At least one tooltip-component or container type component in this layer
		Object.values(l.components).some(c => c.tooltip_text) && l.canvas.addEventListener("mousemove", e => Tooltip.update(l));
	}
};

Tooltip.update = l => {
	let c = Component.locate(l, WINDOW.X, WINDOW.Y);

	if (c && c.tooltip_text) {
		Tooltip.style.left = `${WINDOW.X + 9 * scale}px`;
		Tooltip.style.top = `${WINDOW.Y - 15 * scale}px`;

		if (!Tooltip.visible) {
			Tooltip.toggle(1);

			if (Tooltip.text.raw !== c.tooltip_text) {
				Tooltip.ctx.clearRect(0, 0, Tooltip.width, Tooltip.height);
				Tooltip.render(c);
			}
		}
	} else if (Tooltip.visible) Tooltip.toggle(0);
};

/**
 * Print the component text value on the tooltip.
 * @param	{object}	component	The component to be printed
 */
Tooltip.render = component => {
	let ctx = Tooltip.ctx,
		text = compute_text(component.tooltip_text, true),
		w = 6 * scale,
		h = 8 * scale;

	Tooltip.text = text.raw;

	// Resize tooltip
	Tooltip.width = text.max_width;
	Tooltip.height = text.max_height;
	Tooltip.style.width = `${Tooltip.width}px`;
	Tooltip.style.height = `${Tooltip.height}px`;

	// Print text (and possible text shadow)
	ctx.filter = `drop-shadow(0 ${-Tooltip.height}px 0 #ffffff) drop-shadow(${scale}px ${scale}px 0 #3f3f3f)`;
	for (let c of text.raw) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x,
			c.y + Tooltip.height,
			w,
			h,
		);
	}
	ctx.filter = "none";

	// Remove the base text since it isn't needed anymore
	ctx.clearRect(
		0,
		Tooltip.height,
		Tooltip.width,
		Tooltip.height,
	);
};

Tooltip.appendChild(Tooltip.canvas);
document.body.appendChild(Tooltip);