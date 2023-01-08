import {scale} from "../functions/rescale.js";
import {WINDOW, LAYERS} from "../main.js";

export let Tooltip = document.createElement("div");

Tooltip.id = "tooltip";
Tooltip.visible = 0;
Tooltip.canvas = document.createElement("canvas");
Tooltip.ctx = Tooltip.canvas.getContext("2d");
Tooltip.toggle = (v = !Tooltip.visible) => {
	Tooltip.visible = Number(v);

	Tooltip.style.opacity = Tooltip.visible;
	Tooltip.canvas.style.opacity = Tooltip.visible;
};
Tooltip.init = () => {
	// For each layer, get the list of components which use a tooltip
	for (let l of LAYERS) {
		let test = Object.values(l.components).some(c => c.tooltip || c.type === "container");
		// At least one tooltip-component or container type component in this layer
		test && l.canvas.addEventListener("mousemove", e => Tooltip.render(l, WINDOW.X, WINDOW.Y));
	}
};
Tooltip.render = (l, x, y) => {
	let c = l.get_component_at(x, y);

	if (c && c.tooltip) {
		// TODO: Draw tooltip text
		//

		Tooltip.style.left = `${x + 9 * scale}px`;
		Tooltip.style.top = `${y - 15 * scale}px`;
		Tooltip.toggle(1);
	} else Tooltip.toggle(0);
};

Tooltip.appendChild(Tooltip.canvas);