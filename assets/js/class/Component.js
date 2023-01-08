import {scale} from "../functions/rescale.js";
import {SOURCES, Color} from "../main.js";

/**
 * Construct a new layer component.
 * @param	{object}	[component={}]						Component data object
 * @param	{string}	[component.type="default"]			Component type
 * @param	{array}		[component.origin=["left", "top"]]	Component origin
 * @param	{array}		[component.offset=[0, 0]]			Component offset
 * @param	{array}		[component.size=[0, 0]]				Component size
 * @param	{string}	[component.texture]					Component texture file path, if text component the texture will be the font file path
 * @param	{array}		[component.uv=[0, 0]]				Component texture offset
 * @param	{array}		[component.slots=[]]				Component slots
 * @param	{string}	[component.text=""]					Component text value
 * @param	{string}	[component.text_background]			Component text background color (hexadecimal)
 * @param	{number}	[component.text_background_alpha=1]	Component text background alpha value
 * @param	{string}	[component.color=Color.white]		Component text color (hexadecimal)
 * @param	{boolean}	[component.text_shadow=false]		Component text shadow
 */
export function Component(c = {}) {
	// Name
	this.name = c.name;

	// Type
	this.type = c.type ?? "default";

	// Origin
	this.origin = c.origin ?? ["left", "top"];

	// Offset
	this.offset = c.offset ?? [0, 0];

	// Size
	this.size = c.size ?? [0, 0];

	// Texture file path
	this.texture = c.texture;

	// Texture offset
	this.uv = c.uv ?? [0, 0];

	// Tooltip attribute
	this.tooltip = c.tooltip;

	// Hovered attribute
	this.hovered = false;

	// Attributes that depend on component type
	switch (c.type) {
		case "text":
			// Font file path
			this.texture = "font/ascii.png";

			// Text value
			this.text = c.text ?? "";

			// Text color
			this.color = c.color ?? Color.white;

			// Text shadow
			this.text_shadow = c.text_shadow ?? false;

			// Background color
			this.text_background = c.text_background ?? false;

			// Background opacity
			this.text_background_alpha = c.text_background_alpha ?? 1;

			break;
		case "container":
			// Slot list
			this.slots = c.slots ?? [];

			// Assign each slot to this component
			this.slots.forEach(s => s.component = this);

			/**
			 * Calculate the scaled offset/size and absolute position for the specified slot.
			 * @param	{object}	s	Slot
			 */
			this.compute_slot = s => {
				// Get scaled offset
				let o = [
					s.offset[0] * scale,
					s.offset[1] * scale,
				];

				// Scale the size
				s.w = s.size[0] * scale;
				s.h = s.size[1] * scale;

				// Calculate absolute position
				s.x = this.x + o[0];
				s.y = this.y + o[1];

				return this;
			};

			/**
			 * Return the slot found at the event coordinates, or false if none is found.
			 * @param	{number}	x							X coordinate
			 * @param	{number}	y							Y coordinate
			 * @param	{boolean}	[include_references=true]	Indicate whether to include reference slots in the return
			 */
			this.get_slot_at = (x, y, include_references = true) => {
				for (let s of this.slots) {
					if (
						x >= s.x		&&	// Left side
						x < s.x + s.w	&&	// Right side
						y >= s.y		&&	// Top side
						y <= s.y + s.h		// Bottom side
					) return include_references && s.refer_to ? s.refer_to : s;
				}

				return false;
			};

			break;
	}

	// Add the texture path to the source list
	this.texture && SOURCES.push(this.texture);
}