import {TEXTURES, Font, Color, BackgroundColor} from "../main.js";
import {Component} from "./Component.js";
import {scale} from "../functions/rescale.js";

export const Text = function(component) {
	Component.call(this, component);

	// Size (calculated when computing)
	this.size = [];

	// Text value
	this.text = component.text;

	// Text color
	this.color = component.color ?? "white";

	// Text shadow
	this.text_shadow = component.text_shadow ?? false;
};

Text.compute = (component, title = false) => {
	// Split the text into lines
	let lines = component.text.split("\n").map(l => Object({
			chars: l.split("").map(c => Object({
				letter: c,
				x: 0,
				y: 0,
				u: 0,
				v: 0,
			})),
			height: 10,
		})),
		x,
		y = 0,
		max_width = [],
		max_height = 0,
		raw = [];

	// The first line has a bottom offset
	title && lines[1] && (lines[0].height = 12);

	// Calculate each line width
	for (let line of lines) {
		let width = 0;
		x = 0;

		for (let char of line.chars) {
			let i = Font.chars.indexOf(char.letter),
				w = ((Font.size[char.letter] ?? 5) + 1);

			char.x = x;
			char.y = y;
			char.u = i % 16 * 8;
			char.v = 8 * (Math.floor(i / 16) + 2);
			width += w;

			raw.push(char);

			x += w * scale;
		}

		y += line.height * scale;

		max_width.push(width);
		max_height += line.height;
	}

	component.size = [Math.max(...max_width), max_height];
	component.raw = raw;
};

Text.render = c => {
	let ctx = c.layer.ctx,
		chw = 6 * scale,
		chh = 8 * scale;

	// Print text/text shadow
	ctx.save();
	ctx.filter = `drop-shadow(0 ${-c.h}px 0 ${Color[c.color]})`;
	c.text_shadow && (ctx.filter += `drop-shadow(${scale}px ${scale}px 0 ${BackgroundColor[c.color]}`);
	for (let ch of c.raw) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			ch.u,
			ch.v,
			6,
			8,
			c.x + ch.x,
			c.y + ch.y + c.h,
			chw,
			chh,
		);
	}
	ctx.restore();

	// Remove the base text since it isn't needed anymore
	ctx.clearRect(
		c.x,
		c.y + c.h,
		c.w,
		c.h,
	);

	// Slightly darken the text color
	ctx.globalCompositeOperation = "source-atop";
	ctx.fillStyle = `#00000003`;
	ctx.fillRect(
		c.x,
		c.y,
		c.w,
		c.h,
	);
};