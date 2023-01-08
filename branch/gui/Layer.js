import {WINDOW, SOURCES, TEXTURES, LAYERS, Font, Color, Visibilities, LayerFragment, scale} from "./main.js";
import {Button} from "./Button.js";
import {Text} from "./Text.js";
import {tooltip_elements} from "./Tooltip.js";

/**
 * Construct a new interface layer with an associated canvas. * Param	Type		Name=Default				Description
 * @param	{object}	[l={}]						Layer data object
 * @param	{string}	l.name						Name (used as canvas ID)
 * @param	{object}	[l.parent=LayerFragment]	DOM parent
 * @param	{boolean}	[l.visible=1]				Visibility state
 * @param	{object}	[l.components={}]			Layer component list
 */
export function Layer(l = {}) {
	// Name
	this.name = l.name;

	// DOM parent
	this.parent = l.parent ?? LayerFragment;

	// Visibility
	this.visible = l.visible ?? true;

	// Canvas
	this.canvas = document.createElement("canvas");

	// Canvas context
	this.ctx = this.canvas.getContext("2d");

	// Component list
	this.components = l.components ?? {};
	this.buttons = [];
	Object.entries(this.components).forEach(c => {
		c[1].name = c[0];
		c[1].layer = this;
		c[1].type === "button" && this.buttons.push(c[1]);
		c[1].texture && SOURCES.push(c[1].texture);
		c[1].tooltip_text && tooltip_elements.push(c[1]);
	});
	this.component_values = Object.values(this.components);

	/**
	 * Set the layer size and redraw its components.
	 * @param	{number}	[w=WINDOW.W]	Width value
	 * @param	{number}	[h=WINDOW.H]	Height value
	 */
	this.resize = (w = WINDOW.W, h = WINDOW.H) => {
		this.w = w;
		this.h = h;
		this.redraw();

		return this;
	};

	/**
	 * Toggle the layer visibility.
	 * NOTE: The state will be the opposite of the current visibility if omitted.
 	 * @param	{number|boolean}	[v=!this.visible]	New visibility value
	 */
	this.toggle = (v = !this.visible) => {
		this.visible = Number(v);
		this.canvas.style.visibility = Visibilities[this.visible];

		return this;
	};

	/**
	 * Calculate the scaled offset/size and absolute position for the specified component.
 	 * @param	{object}	c	Component
	 */
	this.compute = c => {
		// Get scaled offset
		let o = [
			c.offset[0] * scale,
			c.offset[1] * scale,
		];

		// Text components don't have size values by default, we need to calculate them using line size
		if (c.type === "text") {
			// Explode the text in lines
			c.lines = c.text.split("\n");

			let widths = [];

			// Calculate line widths
			for (let l of c.lines) {
				let w = 0;
				for (let c of l) {
					w += (Font.size[c] ?? 5) + 1;
				}
				widths.push(w);
			}

			// The width is the max line width found for this component
			c.size[0] = Math.max(...widths) + 2;

			// Multiply line number to get the height
			c.size[1] = 9 * c.lines.length;
		}

		if (c.type === "button") {
			let w = 0;
			for (let char of c.text) {w += (Font.size[char] ?? 5) + 1}

			// The width is the max line width found for this component
			c.text_size[0] = w * scale;

			// Multiply line number to get the height
			c.text_size[1] = 9 * scale;
		}

		// Scale the size
		c.w = c.size[0] * scale;
		c.h = c.size[1] * scale;

		// Calculate absolute X position
		switch (c.origin[0]) {
			case "left":
				c.x = o[0];
				break;

			case "right":
				c.x = this.w - c.w - o[0];
				break;

			case "center":
				c.x = this.w / 2 - c.w / 2 + o[0];
				break;
		}

		// Calculate absolute Y position
		switch (c.origin[1]) {
			case "top":
				c.y = o[1];
				break;

			case "bottom":
				c.y = this.h - c.h - o[1];
				break;

			case "center":
				c.y = this.h / 2 - c.h / 2 + o[1];
				break;
		}

		return this;
	};

	/**
	 * Redraw the specified component(s) on the canvas, or all if omitted (with a canvas clearing).
	 * NOTE: This method doesn't reload the component textures.
	 * @param	{...object|string}	[cs]	Component(s) to be redrawed
	 */
	this.redraw = (...cs) => {
		let redraw_all = false;

		if (!cs.length) {
			redraw_all = true;
			cs = Object.values(this.components).map(c => c.name);
			this.erase();
		}

		for (let c of cs) {
			typeof c === "string" && (c = this.components[c]);

			!redraw_all && this.erase(c);
			this.compute(c).draw(c);
		}

		return this;
	};

	/**
	 * Draw a specified non-text component on the canvas.
	 * @param	{object}	c	Component to be drawed
	 */
	this.draw = c => {
		switch (c.type) {
			case "button":
				Button.render(c);

				break;
			case "text":
				Text.render(c);

				break;
			case "default":
				this.ctx.drawImage(
					TEXTURES[c.texture],
					c.uv[0],
					c.uv[1],
					c.size[0],
					c.size[1],
					c.x,
					c.y,
					c.w,
					c.h,
				);

				break;
		}

		return this;
	};

	/**
	 * Erase the specified component on the canvas, or the whole canvas if omitted.
	 * @param	{object}	[c]	Component to be erased
	 */
	this.erase = c => {
		if (c) {
			let h = c.h + (c.text_shadow ? scale : 0);
			this.ctx.clearRect(c.x, c.y, c.w, h);
		} else this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this;
	};

	// Add this layer to the layer list
	LAYERS.push(this);

	// Set canvas class name
	this.canvas.className = `layer ${this.name}`;

	// Stretch the canvas to full screen size
	this.canvas.width = WINDOW.MW;
	this.canvas.height = WINDOW.MH;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the canvas to the layer parent
	this.parent.appendChild(this.canvas);

	// Set default canvas visibility
	this.toggle(this.visible);
}