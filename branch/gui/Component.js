/**
 * Construct a new component.
 * @param	{object}	[component={}]		Component data object
 * @param	{array}		component.origin	Component origin
 * @param	{array}		component.offset	Component offset
 * @param	{array}		component.size		Component size
 * @param	{string}	component.texture	Component texture file path, if text component the texture will be the font file path
 * @param	{array}		component.uv		Component texture offset
 */
export const Component = function(c = {}) {
	// Type
	this.type = "default";

	// Origin
	this.origin = c.origin;

	// Offset
	this.offset = c.offset;

	// Size
	this.size = c.size;

	// Texture file path
	this.texture = c.texture;

	// Texture offset
	this.uv = c.uv;
};

/**
 * Search for a component at the specified coordinates on the layer and render the found component or false.
 * @param	{object}	l	The layer where to search
 * @param	{number}	x	The X position
 * @param	{number}	y	The Y position
 * @param	{array}		cs	The predefined list of components to search through
 */
Component.locate = (l, x, y, cs = l.component_values) => {
	for (let c of cs) {
		if (
			x >= c.x		&&	// Left side
			x <= c.x + c.w	&&	// Right side
			y >= c.y		&&	// Top side
			y <= c.y + c.h		// Bottom side
		) return c;
	}

	return false;
};