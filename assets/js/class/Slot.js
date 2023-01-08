import {scale} from "../functions/rescale.js";
import {Font, slot_hovered} from "../main.js";
import {TEXTURES} from "../functions/load_textures.js";

let i = 0;

/**
 * Construct a new slot (item parent container).
 * @param	{object}	[slot={}]		Slot data object
 * @param	{string}	slot.type		Type
 * @param	{array}		slot.offset		Offset
 * @param	{object}	[slot.refer_to]	Reference to the parent slot
 */
export const Slot = function(slot = {}) {
	// ID
	this.id = i++;

	// Type
	this.type = slot.type;

	// Parent component
	this.component = null;

	// Offset
	this.offset = slot.offset;

	// Size
	this.size = [18, 18];

	// Hover attribute
	this.hovered = false;

	if (slot.refer_to) {
		// This slot is refering to another slot
		let reference = slot.refer_to;

		// Create an array of refering slots for the reference slot if it hasn't been initialized yet
		reference.reference_for ??= [];

		// Link the reference slot with this slot
		reference.reference_for.push(this);

		// Make a backlink on the refering slot
		this.refer_to = reference;
	} else {
		// This slot is not refering to another slot; it can be either a single slot or a reference slot
		this.item = null;

		/**
		 * Assign an item to the slot and return the previous one if it exists.
		 * NOTE: This method loads the item texture if it has not been loaded already.
		 * @param	{object}	i	The item to be assigned
		 */
		this.assign = i => {
			// Stock the previous item during the swap
			let prev_item = this.item,
				render = () => {
					// Append the item to the slot
					i.slot = this;
					this.item = i;

					// Render updated slot
					let ss = this.reference_for || [this];
					for (let s of ss) {s.draw_item()}
				};

			// Check if the item texture is already loaded, and load it in this case
			if (!(i.texture in TEXTURES)) {
				TEXTURES[i.texture] = new Image();
				TEXTURES[i.texture].addEventListener("load", render);
				TEXTURES[i.texture].src = `assets/textures/${i.texture}`;
			} else render();

			return prev_item;
		};

		/**
		 * Remove the slot item.
		 */
		this.empty = () => {
			this.item = null;

			let ss = this.reference_for || [this];
			for (let s of ss) {
				s.component.layer.ctx.clearRect(
					s.x + scale,
					s.y + scale,
					s.w - 2 * scale,
					s.h - 2 * scale,
				);

				s.component.layer.ctx.drawImage(
					TEXTURES[s.component.texture],
					s.offset[0] + 1,
					s.offset[1] + 1,
					16,
					16,
					s.x + scale,
					s.y + scale,
					s.w - 2 * scale,
					s.h - 2 * scale,
				);
			}

			return this;
		};
	}

	this.draw_item = () => {
		// Draw slot item if there is one
		let item = this.refer_to ? this.refer_to.item : this.item;
		if (item) {
			this.component.layer.ctx.drawImage(
				TEXTURES[item.texture],
				0,
				0,
				16,
				16,
				this.x + scale,
				this.y + scale,
				this.w - 2 * scale,
				this.h - 2 * scale,
			);

			/*if (item.stack_count !== 1) {
				let stack_count = String(item.stack_count),
					x = this.x + scale,
					y = this.y + scale;

				for (let c of stack_count) {
					let i = Font.chars.indexOf(c),
						u = i % 16 * 8,
						v = 8 * (Math.floor(i / 16) + 2);

					this.component.layer.ctx.drawImage(
						TEXTURES["font/ascii.png"],
						u,
						v,
						6,
						8,
						x,
						y,
						6 * scale,
						8 * scale,
					);

					x += ((Font.size[c] ?? 5) + 1) * scale;
				}
			}*/
		}
	};
}