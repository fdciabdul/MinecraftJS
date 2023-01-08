import {Component} from "./Component.js";
import {TEXTURES, Font, scale} from "./main.js";

/**
 * Construct a new button. The Component constructor is called first.
 * @param	{object}	b					Button data object
 * @param	{boolean}	[b.disabled=false]	Button disabled attribute
 * @param	{string}	b.text				Button text value (one line)
 * @param	{function}	[b.action=Function]	Button action callback
 * @param	{string}	[b.tooltip_text]	Button tooltip text (this will enable the tooltip for this component)
 */
export const Button = function(b) {
	Component.call(this, b);

	// Type
	this.type = "button";

	// Disabled attribute
	this.disabled = b.disabled ?? false;

	// Hover attribute
	this.hovered = false;

	// Texture file
	this.texture = "gui/widgets.png";

	// Default texture offset
	this.uv = this.disabled ? [0, 46] : [0, 66];

	// Second texture offset
	this.uv_hover = [0, 86];

	// Text value
	this.text = b.text;

	// Text size
	this.text_size = [];

	// Action callback
	this.action = b.action ?? Function;

	// Tooltip text value
	this.tooltip_text = b.tooltip_text;
};

/**
 * Search for a button at the specified coordinates on the layer and render the found button or false.
 * @param	{object}	l	The layer where to search
 * @param	{number}	x	The X position
 * @param	{number}	y	The Y position
 */
Button.locate = (l, x, y) => {
	return Component.locate(l, x, y, l.buttons);
};

/**
 * Draw a button component.
 * @param	{object}	b	The button to be rendered
 */
Button.render = b => {
	let ctx = b.layer.ctx,
		x0 = b.x + (b.w - b.text_size[0]) / 2,
		x = x0,
		y = b.y + (b.h - b.text_size[1] + scale) / 2,
		char_w = 6 * scale,
		char_h = 8 * scale;

	// Clear old text data
	b.char_data = [];

	for (let c of b.text) {
		let i = Font.chars.indexOf(c),
			u = i % 16 * 8,
			v = 8 * (Math.floor(i / 16) + 2);

		b.char_data.push({
			x: x,
			u: u,
			v: v,
		});

		x += ((Font.size[c] ?? 5) + 1) * scale;
	}

	// Reset X position
	x = x0;

	// Draw text shadow (disabled buttons also have it)
	for (let c of b.char_data) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x + scale, // Text shadow offset
			y + scale, // Text shadow offset
			char_w,
			char_h,
		);
	}

	ctx.globalCompositeOperation = "source-atop";

	// Set the text shadow color
	ctx.fillStyle = "#000000c0";
	ctx.fillRect(
		x,
		y,
		b.text_size[0],
		b.text_size[1],
	);

	ctx.globalCompositeOperation = "source-over";

	// Draw text value
	for (let c of b.char_data) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			c.x,
			y,
			char_w,
			char_h,
		);
	}

	// Set the text color
	if (b.disabled) {
		ctx.globalCompositeOperation = "source-atop";

		ctx.fillStyle = "#0000005f";
		ctx.fillRect(
			x,
			y,
			b.text_size[0],
			b.text_size[1],
		);
	}

	let uv = b.hovered ? b.uv_hover : b.uv,
		w2 = b.size[0] / 2,
		w2s = b.w / 2;

	ctx.globalCompositeOperation = "destination-over";

	// Draw background left part
	ctx.drawImage(
		TEXTURES[b.texture],
		uv[0],
		uv[1],
		w2,
		b.size[1],
		b.x,
		b.y,
		w2s,
		b.h,
	);

	// Draw background right part
	ctx.drawImage(
		TEXTURES[b.texture],
		uv[0] + (200 - w2),
		uv[1],
		w2,
		b.size[1],
		b.x + w2s,
		b.y,
		w2s,
		b.h,
	);
};