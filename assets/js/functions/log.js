import {debug_enabled} from "../../../branch/gui/main.js";

/**
 * Display a debug log in the console.
 * @param	{...*}	m	Log message
 */
export const log = (...m) => {
	debug_enabled && console.debug(...m);
};