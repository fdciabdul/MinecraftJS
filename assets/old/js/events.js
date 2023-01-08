// Focus page event
addEventListener("click", () => {
	if (!ContainerLayer.visible && !MenuLayer.visible) Controls.lock();
});

// Context menu event
addEventListener("contextmenu", e => e.preventDefault());

// Press key event
addEventListener("keydown", e => {
	// Allow page refreshing and cache clearing
	if (!/^(Control(Left|Right)|F\d+)$/.test(e.code)) e.preventDefault();
	keys.push(e.code);
});

// Release key event
addEventListener("keyup", e => {
	const newKeys = [];
	keys.forEach(key => {
		if (key !== e.code) newKeys.push(key);
	});
	keys = newKeys;
});

// Resize window event
addEventListener("resize", () => {
	WINDOW_WIDTH = window.innerWidth;
	WINDOW_HEIGHT = window.innerHeight;

	Renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
	Camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
	Camera.updateProjectionMatrix();
});

// Switch selected item (wheel event)
let selected_slot = 0;
addEventListener("wheel", e => {
	if (!ContainerLayer.visible && !MenuLayer.visible) {
		if (e.deltaY > 0) {
			// Move selector to right
			selected_slot = selected_slot < 8 ? ++selected_slot : 0;
		} else {
			// Move selector to left
			selected_slot = selected_slot > 0 ? --selected_slot : 8;
		}

		HUDLayer.components.selector.setPosition([
			-160 + selected_slot * 40,
			HUDLayer.components.selector.origin.y,
		]);
		HUDLayer.update();
	}
});