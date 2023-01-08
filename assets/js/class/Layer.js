import {scale} from "../functions/rescale.js";
import {Component} from "./Component.js";
import {Tooltip} from "./Tooltip.js";
import {WINDOW, LAYERS, Font, LayerFragment} from "../main.js";
import {TEXTURES} from "../functions/load_textures.js";

const Visibilities = ["hidden", "visible"];

/**
 * Construct a new interface layer with an associated canvas.
 * @param	{object}	[layer={}]						Layer data object
 * @param	{string}	layer.name						Name (used as canvas ID)
 * @param	{object}	[layer.parent=LayerFragment]	DOM parent
 * @param	{boolean}	[layer.visible=1]				Visibility state
 * @param	{object}	[layer.components={}]			Layer component list
 */
export function Layer(layer = {}) {
	// Name
	this.name = layer.name;

	// DOM parent
	this.parent = layer.parent ?? LayerFragment;

	// Size
	this.w = WINDOW.W;
	this.h = WINDOW.H;

	// Visibility
	this.visible = layer.visible ?? 1;

	// Canvas
	this.canvas = document.createElement("canvas");

	// Canvas context
	this.ctx = this.canvas.getContext("2d");

	// Component list
	this.components = {};
	for (let c of layer.components) {
		this.components[c.name] = new Component(c);
		this.components[c.name].layer = this;
	}
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
	 * Toggle layer visibility using a canvas CSS attribute. If omitted, the state will be the opposite of the current visibility.
 	 * @param	{boolean}	[v=!this.visible]	New visibility value
	 */
	this.toggle = (v = !this.visible) => {
		this.visible = Number(v);

		this.canvas.style.visibility = Visibilities[this.visible];

		this.visible ? Tooltip.render(this, WINDOW.X, WINDOW.Y) : Tooltip.toggle(0);

		return this;
	};

	/**
	 * Find the first component which has the same name as the specified value and return it.
 	 * @param	{string}	n	Component name
	 */
	this.get = n => this.component_values.find(c => c.name === n);

	this.get_component_at = (x, y) => {
		for (let c of this.component_values) {
			if (
				x >= c.x		&&	// Left side
				x < c.x + c.w	&&	// Right side
				y >= c.y		&&	// Top side
				y <= c.y + c.h		// Bottom side
			) return c;
		}

		return false;
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

			// The width is the longest calculated line width
			c.size[0] = Math.max(...widths) + 2;

			// Multiply the line count to get the component height
			c.size[1] = 9 * c.lines.length;
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
				c.x = .5 * (this.w - c.w) + o[0];

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
				c.y = .5 * (this.h - c.h) + o[1];

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
			cs = this.component_values.map(c => c.name);
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
			case "text":
				let x, y = c.y + scale;

				for (let l of c.lines) {
					x = c.x + scale;

					for (let ch of l) {
						let i = Font.chars.indexOf(ch),
							u = i % 16 * 8,
							v = 8 * (Math.floor(i / 16) + 2);

						if (c.text_shadow) {
							this.ctx.globalAlpha = .245;
							this.ctx.drawImage(
								TEXTURES[c.texture],
								u,
								v,
								6,
								8,
								x + scale,
								y + scale,
								6 * scale,
								8 * scale,
							);
							this.ctx.globalAlpha = 1;
						}

						this.ctx.drawImage(
							TEXTURES[c.texture],
							u,
							v,
							6,
							8,
							x,
							y,
							6 * scale,
							8 * scale,
						);						

						x += ((Font.size[ch] ?? 5) + 1) * scale;
					}

					y += 9 * scale;
				}

				this.ctx.globalCompositeOperation = "source-atop";
				this.ctx.fillStyle = c.color;
				this.ctx.fillRect(
					c.x,
					c.y,
					c.w,
					c.h + (c.text_shadow ? scale : 0),
				);

				if (c.text_background) {
					this.ctx.globalCompositeOperation = "destination-over";
					this.ctx.fillStyle = c.text_background;
					this.ctx.globalAlpha = c.text_background_alpha;
					this.ctx.fillRect(
						c.x,
						c.y,
						c.w,
						c.h + (c.text_shadow ? scale : 0),
					);
					this.ctx.globalAlpha = 1;
				}

				// Reset the composite operation for next drawings
				this.ctx.globalCompositeOperation = "source-over";

				break;
			default:
				if (c.texture) {
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
				}

				if (c.type === "container") {
					for (let s of c.slots) {
						c.compute_slot(s);
						s.hovered = false;
						s.draw_item();
					}
				}

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

	// Add the layer to the layer array
	LAYERS.push(this);

	// Set canvas class
	this.canvas.className = `layer ${this.name}`;

	// Make the canvas take the full screen size
	this.canvas.width = WINDOW.MW;
	this.canvas.height = WINDOW.MH;

	// Remove canvas blur effect
	this.ctx.imageSmoothingEnabled = false;

	// Append the canvas to the layer parent
	this.parent.appendChild(this.canvas);

	// Set default canvas visibility
	this.toggle(this.visible);
}