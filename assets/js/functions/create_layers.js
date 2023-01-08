// HUD layer
UI.hud = new Layer({
	name: "hud",
	components: {
		hotbar: new Component({
			type: "container",
			origin: ["center", "bottom"],
			size: [182, 22],
			texture: "gui/widgets.png",
			slots: Array.from({length: 9}, (_, i) => new Slot({
				type: "hotbar",
				offset: [
					2 + i * 20,
					2,
				],
				refer_to: Slots.hotbar[i],
			})),
		}),
		selector: new Component({
			origin: ["center", "bottom"],
			offset: [20 * (selected_slot - 4), -1],
			size: [24, 24],
			texture: "gui/widgets.png",
			uv: [0, 22],
		}),
	},
});

// Crosshair layer
UI.crosshair = new Layer({
	name: "crosshair",
	components: {
		crosshair: new Component({
			origin: ["center", "center"],
			size: [9, 9],
			texture: "gui/icons.png",
			uv: [3, 3],
		}),
	},
});

// Debug menu layer
UI.debug = new Layer({
	name: "debug",
	visible: debug_visible,
	components: {
		version: new Component({
			type: "text",
			offset: [1, 1],
			text: "Minecraft JS (pre-alpha 220403)",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		fps: new Component({
			type: "text",
			offset: [1, 10],
			text: get_fps(),
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		xyz: new Component({
			type: "text",
			offset: [1, 28],
			text: "XYZ: 0.000 / 0.00000 / 0.000",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		block: new Component({
			type: "text",
			offset: [1, 37],
			text: "Block: 0 0 0",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		chunk: new Component({
			type: "text",
			offset: [1, 46],
			text: "Chunk: 0 0 0",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		facing: new Component({
			type: "text",
			offset: [1, 55],
			text: "Facing: - (Towards - -) (0 / 0)",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		js: new Component({
			type: "text",
			origin: ["right", "top"],
			offset: [1, 1],
			text: `JavaScript: ${get_js_version()} ${get_registry_size()}bit`,
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		cpu: new Component({
			type: "text",
			origin: ["right", "top"],
			offset: [1, 19],
			text: `CPU: ${navigator.hardwareConcurrency}x`,
			text_background: "#080400",
			text_background_alpha: .21,
		}),
		display: new Component({
			type: "text",
			origin: ["right", "top"],
			offset: [1, 37],
			text: "Display:",
			text_background: "#080400",
			text_background_alpha: .21,
		}),
	},
});

// Inventory layer
UI.inventory = new Layer({
	name: "inventory",
	// visible: 0,
	components: {
		player_inventory: new Component({
			type: "container",
			origin: ["center", "center"],
			size: [176, 166],
			texture: "gui/container/inventory.png",
			slots: [].concat(
				Array.from({length: 27}, (_, i) => new Slot({
					type: "storage",
					offset: [7 + 18 * (i % 9), 83 + 18 * Math.floor(i / 9)],
				})),
				Array.from({length: 9}, (_, i) => new Slot({
					type: "hotbar",
					offset: [7 + 18 * i, 141],
					refer_to: Slots.hotbar[i],
				})),
			),
		}),
	},
});

// Tooltip layer
/*UI.tooltip = new Layer({
	name: "tooltip",
	visible: 0,
	components: {
		display_name: new Component({
			type: "text",
			text: "",
			text_shadow: true,
		}),
		name: new Component({
			type: "text",
			offset: [0, 12],
			text: "",
			color: Color.dark_gray,
			text_shadow: true,
		}),
	},
});*/

// Pause menu layer
UI.pause = new Layer({
	name: "pause",
	visible: 0,
	components: {
		title: new Component({
			type: "text",
			origin: ["center", "top"],
			offset: [0, 9],
			text: "Game Paused",
			text_shadow: true,
			tooltip: "OKAY",
		}),
	},
});

// Flowing item layer
UI.flowing_item = new Layer({
	name: "flowing_item",
	// visible: 0,
	components: {
		item: new Component({
			origin: ["left", "top"],
			offset: [0, 0],
			size: [16, 16],
		}),
	},
});