/**
 * Return the registry size (32 or 64) using the Navigator object.
 */
export const get_registry_size = () => {
	return (
		navigator.userAgent.indexOf("Win64") !== -1 ||
		navigator.userAgent.indexOf("WOW64") !== -1 ||
		navigator.platform === "Win64"
	) ? 64 : 32;
};