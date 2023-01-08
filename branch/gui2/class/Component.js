/**
 * Build a new component.
 * @param	{object}	[component={}]				Component data object
 * @param	{array}		[component.type="default"]	Type
 * @param	{array}		component.origin			Origin
 * @param	{array}		component.offset			Offset
 * @param	{array}		component.size				Size
 * @param	{string}	component.texture			Texture file path
 * @param	{array}		component.uv				Offset in the texture file
 */
export const Component = function(component = {}) {
	// Type
	this.type = component.type ?? "default";

	// Visibility
	this.visible = component.visible ?? true;

	// Origin
	this.origin = component.origin;

	// Default offset
	this.offset = component.offset;

	// Default size
	this.size = component.size;

	if (this.type === "default") {
		// Texture file path
		this.texture = component.texture;

		// Texture offset
		this.uv = component.uv;
	}
};

/**
 * Search for a component in a layer at the specified coordinates. Return the found component, or false otherwise.
 * @param	{array}		[components=layer.component_values]	Array of components to search through
 * @param	{number}	x									X position
 * @param	{number}	y									Y position
 */
Component.locate = (components = layer.component_values, x, y) => {
	for (let c of components) {
		if (
			x >= c.x		&&	// Left side
			x <= c.x + c.w	&&	// Right side
			y >= c.y		&&	// Top side
			y <= c.y + c.h		// Bottom side
		) return c;
	}

	return false;
};