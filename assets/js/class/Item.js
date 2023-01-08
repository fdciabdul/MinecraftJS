import {Items} from "../main.js";

/**
 * Create a new game item.
 * @param	{number}	id				Item ID
 */
export const Item = function(id) {
	// Get the item from the fetched item list
	let item = Items.find(i => i.id === id);

	// ID
	this.id = id;

	// Display name
	this.display_name = item.displayName;

	// Code name
	this.name = item.name;

	// Parent slot
	this.slot = null;

	// Texture file path
	this.texture = `item/${this.name}.png`;

	// Count
	this.stack_count = 17;
}