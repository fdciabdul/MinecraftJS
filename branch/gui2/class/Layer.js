import {WINDOW, SOURCES, TEXTURES} from "../main.js";
import {Component} from "./Component.js";
import {Text} from "./Text.js";
import {scale} from "../functions/rescale.js";

export const
	// Layer fragment element
	LayerFragment = document.createDocumentFragment(),
	/**
	 * Build a new interface layer with an associated canvas.
	 * @param	{object}			[layer={}]				Layer data object
	 * @param	{string}			layer.name				Name (used as canvas class attribute)
	 * @param	{boolean|number}	[layer.visible=true]	Visibility state
	 * @param	{array}				[layer.components={}]	Component list
	 */
	Layer = function(layer = {}) {
		// Name
		this.name = layer.name;

		// Component and button lists
		this.components = {};
		this.buttons = [];

		// Fill in the component lists
		for (let component of layer.components) {
			switch (component.type) {
				case "text":
					component = new Text(component);
					break;
				case "button":
					component = new Button(component);
					this.buttons.push(component);
					break;
			}

			component.layer = this;
			this.components[component.name] = component;

			// Add the component texture to the texture source list
			component.texture && SOURCES.push(component.texture);
		}

		// Canvas
		this.canvas = document.createElement("canvas");
		this.canvas.className = `layer ${this.name}`;
		this.canvas.width = WINDOW.MW;
		this.canvas.height = WINDOW.MH;

		// Canvas context
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;

		/**
		 * Toggle the visibility of the layer.
		 * NOTE: The state will be the opposite of the current visibility if omitted.
	 	 * @param	{boolean|number}	[state=!this.visible]	New visibility value
		 */
		this.toggle = (state = !this.visible) => {
			this.visible = Number(state);
			this.canvas.style.visibility = ["hidden", "visible"][this.visible];

			return this;
		};

		/**
		 * Stretch the layer to the window size and redraw the components.
		 * @param	{boolean}	[force_compute=false]	Indicates whether to recompute components before drawing them
		 */
		this.resize = (force_compute = false) => {
			this.w = WINDOW.W;
			this.h = WINDOW.H;
			this.redraw(force_compute);

			return this;
		};

		/**
		 * Redraw the specified component(s) on the canvas, or all if omitted.
		 * NOTE: The force_compute parameter is REQUIRED if components are given!
		 * @param	{boolean}	[force_compute=false]	Indicates whether to recompute components before drawing them
		 * @param	{...string}	[components]			Name of the component(s) to be redrawed
		 */
		this.redraw = (force_compute = false, ...components) => {
			let redraw_all = false;

			if (!components.length) {
				redraw_all = true;
				components = Object.keys(this.components);

				// Clear the whole canvas
				this.erase();
			}

			for (let c of components) {
				c = this.components[c];

				// Redraw the component
				if (c.visible) {
					!redraw_all && this.erase(c);
					this.compute(c, force_compute);
					this.draw(c);
				}
			}

			return this;
		};

		/**
		 * Calculate the scaled offset/size and absolute position for the specified component.
		 * @param	{object}	c				Component to be computed
		 * @param	{boolean}	[rescale=false]	Indicates whether to recalculate the component size
		 */
		this.compute = (c, rescale = false) => {
			if (rescale) {
				switch (c.type) {
					case "text":
						Text.compute(c);
						break;
				}

				c.ox = c.offset[0] * scale;
				c.oy = c.offset[1] * scale;
				c.w = c.size[0] * scale;
				c.h = c.size[1] * scale;
			}

			// Calculate absolute X position
			switch (c.origin[0]) {
				case "left":
					c.x = c.ox;
					break;
				case "right":
					c.x = this.w - c.w - c.ox;
					break;
				case "center":
					c.x = (this.w - c.w) / 2 + c.ox;
					break;
			}

			// Calculate absolute Y position
			switch (c.origin[1]) {
				case "top":
					c.y = c.oy;
					break;
				case "bottom":
					c.y = this.h - c.h - c.oy;
					break;
				case "center":
					c.y = (this.h - c.h) / 2 + c.oy;
					break;
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
					Text.render(c);
					break;
				default:
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

			this.ctx.globalCompositeOperation = "source-over";
		};

		/**
		 * Erase the specified component on the layer, or the whole canvas if omitted.
		 * @param	{object}	[c]	Component to be erased
		 */
		this.erase = c => {
			c ?
				this.ctx.clearRect(c.x, c.y, c.w, c.h) :
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			return this;
		};

		// Set the visibility attribute
		this.toggle(layer.visible);

		// Append the layer canvas to the fragment
		LayerFragment.appendChild(this.canvas);
	};