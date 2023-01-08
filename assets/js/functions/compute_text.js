import {Font, scale} from "../../../branch/gui/main.js";

/**
 * Compute and return the given string.
 * Update ideas:
 * - Return a size array containing the max width & height of the text node
 * - Return an array of objects containing the data of each character
 * - For each character, return:
 * 		- The character letter (string)
 * 		- The character UV in the font/ascii.png file
 * 		- The character position in the layer
 * @param	{string}	text			Inline or multiline string
 * @param	{boolean}	[title=false]	If true, the first line will be higher to make a title (used in tooltips)
 */
export const compute_text = (text, title = false) => {
	// Split the text into lines
	let lines = text.split("\n").map(l => Object({
			chars: l.split("").map(c => Object({
				letter: c,
				x: 0,
				y: 0,
				u: 0,
				v: 0,
			})),
			height: 10,
		})),
		x = 0,
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

	// Calculate final text size
	max_width = Math.max(...max_width) * scale;
	max_height *= scale;

	return {
		raw: raw,
		max_width: max_width,
		max_height: max_height,
	};
};