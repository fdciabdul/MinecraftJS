import {Component} from "./Component.js";
import {TEXTURES, Font, Color, scale} from "./main.js";
import {compute_text} from "../../assets/js/functions/compute_text.js";

export const Text = function(t) {
	Component.call(this, t);

	// Type
	this.type = "text";

	// Size (will be calculated on the computing)
	this.size = []; // ?

	// Text value
	this.text = t.text ?? "";

	// Text color
	this.color = t.color ?? Color.white;

	// Text shadow
	this.text_shadow = t.text_shadow ?? false;
};

/**
 * Draw a text component.
 * @param	{object}	component	The text to be rendered
 */
Text.render = component => {
	let ctx = component.layer.ctx,
		text = compute_text(component.text),
		x = component.x,
		y = component.y,
		w = 6 * scale,
		h = 8 * scale;

	ctx.save();

	// Print text (and possible text shadow)
	ctx.filter = `drop-shadow(0 ${-text.max_height}px 0 ${component.color})`;
	component.text_shadow && (ctx.filter += `drop-shadow(${scale}px ${scale}px 0 #3f3f3f`);
	for (let c of text.raw) {
		ctx.drawImage(
			TEXTURES["font/ascii.png"],
			c.u,
			c.v,
			6,
			8,
			x + c.x,
			y + c.y + text.max_height,
			w,
			h,
		);
	}
	ctx.filter = "none";

	// Remove the base text since it isn't needed anymore
	ctx.clearRect(
		x,
		y + text.max_height,
		text.max_width,
		text.max_height,
	);

	// Slightly darken the text color
	ctx.globalCompositeOperation = "source-atop";
	ctx.fillStyle = `#00000003`;
	ctx.fillRect(
		x,
		y,
		text.max_width,
		text.max_height,
	);

	ctx.restore();
};