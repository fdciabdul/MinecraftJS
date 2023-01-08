/**
 * Generate temporary scripts to get JavaScript version of the browser.
 */
export const get_js_version = () => {
	let i = 1;
	for (; i <= 9; i++) {
		// Create a new script
		let script = document.createElement("script");

		script.setAttribute("language", `javascript1.${i}`);
		script.textContent = `js_version = 1.${i}`;

		document.body.appendChild(script);

		// Remove the script when the version is obtained
		script.remove();
	}

	return js_version;
};