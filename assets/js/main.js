import {Layer} from "./class/Layer.js";
import {Component} from "./class/Component.js";
import {Slot} from "./class/Slot.js";
import {Item} from "./class/Item.js";
// import {Tooltip} from "./class/Tooltip.js";

import {TEXTURES, load_textures} from "./functions/load_textures.js";
import {scale, rescale} from "./functions/rescale.js";
import {get_fps} from "./functions/get_fps.js";
import {get_js_version} from "./functions/get_js_version.js";
import {get_registry_size} from "./functions/get_registry_size.js";

export const
	WINDOW = {
		DW: 320,
		DH: 240,
		W: innerWidth,
		H: innerHeight,
		MW: screen.width,
		MH: screen.height,
		X: 0,
		Y: 0,
	},
	RESOURCES = [
		"assets/font.json",
		"assets/items.json",
		"assets/gui.json",
	],
	LAYERS = [],
	SOURCES = [],
	LayerFragment = document.createDocumentFragment(),
	Hover = document.createElement("div"),
	add_keybind = k => {
		keys.indexOf(k.code) === -1 && keys.push(k.code);
		switch (k.code) {
			case Keybind.toggle_hud:
				if (!LAYERS.inventory.visible && !LAYERS.pause.visible && Player.permissions.toggle_hud) {
					LAYERS.hud.toggle();
					LAYERS.crosshair.toggle();
					LAYERS.debug.toggle(debug_visible && LAYERS.hud.visible);
				}
				Player.permissions.toggle_hud = false;

				break;
			case Keybind.open_inventory:
				if (!LAYERS.pause.visible && Player.permissions.open_inventory) LAYERS.inventory.toggle();
				!LAYERS.inventory.visible && Hover.style.visibility !== "hidden" && (Hover.style.visibility = "hidden");
				Player.permissions.open_inventory = false;
				slot_hovered && slot_hovered.draw_item();

				break;
			case Keybind.toggle_debug:
				if (!LAYERS.inventory.visible && !LAYERS.pause.visible && Player.permissions.toggle_debug) {
					debug_visible = !debug_visible;
					LAYERS.hud.visible && LAYERS.debug.toggle();
				}
				Player.permissions.toggle_debug = false;

				break;
			case Keybind.escape:
				if (LAYERS.inventory.visible) {
					LAYERS.inventory.toggle(0);
					Hover.style.visibility !== "hidden" && (Hover.style.visibility = "hidden");
				}
				else if (Player.permissions.toggle_pause) LAYERS.pause.toggle();
				Player.permissions.toggle_pause = false;

				break;
		}

		if (!LAYERS.inventory.visible && !LAYERS.pause.visible) {
			for (let s in Keybind.hotbar_slots) {
				if (k.code === Keybind.hotbar_slots[s]) {
					let prev_slot = selected_slot;
					selected_slot = s;
					update_hotbar_selector(prev_slot, selected_slot);

					break;
				}
			}
		}
	},
	remove_keybind = k => {
		// Reset permissions
		for (let p in Player.permissions) {Player.permissions[p] = true}

		// Clear the key list
		keys.splice(keys.indexOf(k.code), 1);
	},
	update_hotbar_selector = (prev, next) => {
		let h = LAYERS.hud.components.hotbar,
			s = LAYERS.hud.components.selector;

		// Clear the previous selected slot
		LAYERS.hud.erase(s);

		// Redraw the part of the hotbar where the selector was
		LAYERS.hud.ctx.drawImage(
			TEXTURES[h.texture],
			h.uv[0] + (prev * 20) - 1,
			h.uv[1],
			s.size[0],
			h.size[1],
			s.x,
			s.y + scale,
			s.w,
			s.h - scale * 2,
		);

		// Update the selector X offset
		s.offset[0] = 20 * (next - 4);

		// Compute and draw the selector on the new hotbar slot
		LAYERS.hud.compute(s).draw(s);

		// Render hotbar items after the selector update
		for (let s of h.slots) {s.draw_item()}
	},
	take_item = s => {
		flowing_item = s.item;
		s.empty();
		LAYERS.flowing_item.canvas.style.left = `${WINDOW.X - 8 * scale}px`;
		LAYERS.flowing_item.canvas.style.top = `${WINDOW.Y - 8 * scale}px`;
		LAYERS.flowing_item.components.item.texture = flowing_item.texture;
		LAYERS.flowing_item.redraw("item");
		LAYERS.flowing_item.toggle(1);
	},
	place_item = s => {
		if (s.item) {
			let flowing_item_memory = flowing_item;
			take_item(s);
			s.assign(flowing_item_memory);
		} else {
			s.assign(flowing_item);
			flowing_item = null;
			LAYERS.flowing_item.components.item.texture = null;
			LAYERS.flowing_item.erase(LAYERS.flowing_item.components.item);
			LAYERS.flowing_item.toggle(0);
		}
	},
	hover_inventory_slots = () => {
		slot_hovered = LAYERS.inventory.components.player_inventory.get_slot_at(WINDOW.X, WINDOW.Y, false);
		if (slot_hovered) {
			if (slot_hovered.id !== previous_slot_hovered.id) {
				Hover.style.left = `${slot_hovered.x + scale}px`;
				Hover.style.top = `${slot_hovered.y + scale}px`;
				Hover.style.visibility !== "visible" && (Hover.style.visibility = "visible");

				previous_slot_hovered = slot_hovered;
			}
		} else if (Hover.style.visibility === "visible") {
			Hover.style.visibility = "hidden";

			previous_slot_hovered = false;
		}
	},
	Keybind = {
		escape: "Escape",
		walk_forwards: "KeyW",
		walk_backwards: "KeyS",
		strafe_left: "KeyA",
		strafe_right: "KeyD",
		jump: "Space",
		toggle_hud: "F1",
		toggle_debug: "F3",
		open_inventory: "Tab",
		hotbar_slots: [
			"Digit1",
			"Digit2",
			"Digit3",
			"Digit4",
			"Digit5",
			"Digit6",
			"Digit7",
			"Digit8",
			"Digit9",
		],
	},
	Player = {
		permissions: {
			open_inventory: true,
			toggle_hud: true,
			toggle_debug: true,
			toggle_pause: true,
		},
	},
	Slots = {
		hotbar: Array.from({length: 9}, (_, i) => {
			return new Slot({
				type: "hotbar",
			});
		}),
	};

export let
	Font = {},									// Fetched font data
	Color,										// Fetched color list
	Items,										// Fetched item list
	LAYER_VALUES,
	keys = [],									// Current pressed keys
	unwanted_keybinds = /^(Tab|Digit4|F1|F3)$/,	// Keys to prevent
	selected_slot = 0,							// Index of the current hotbar slot
	previous_slot_hovered = false,				// Index of the previously selected hotbar slot
	slot_hovered = false,						// Hovered slot reference
	flowing_item,								// Current flowing item data
	held_item = 0,
	debug_visible = false;						// Is debug menu visible

(() => {
	// Verify Fetch API compatibility
	if (!"fetch" in window) return console.error("This browser doesn't support Fetch API.");

	// Fetch JSON resources
	Promise
		.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
		.then(response => {
			// Stock received resources
			Font.chars = response[0].chars;
			Font.size = response[0].size;
			Color = response[0].color;
			Items = response[1];
			


			// Initialize layers
			for (let l of response[2]) {
				LAYERS[l.name] = new Layer(l);
			}



			// LayerFragment.appendChild(Tooltip);
			document.body.appendChild(LayerFragment);

			Hover.className = "hover";
			document.body.appendChild(Hover);

			LAYER_VALUES = Object.values(LAYERS);

			load_textures(() => {
				rescale();

				let bread		= new Item(737),
					pumpkin_pie	= new Item(960),
					cooked_beef	= new Item(854);

				// Window resizing event
				addEventListener("resize", () => {
					Hover.style.visibility !== "hidden" && (Hover.style.visibility = "hidden");
					previous_slot_hovered = false;
					rescale();
				});

				// Keydown event
				addEventListener("keydown", e => {
					unwanted_keybinds.test(e.code) && e.preventDefault();
					add_keybind(e);
				});

				// Keyup event
				addEventListener("keyup", e => remove_keybind(e));

				// Right click event
				addEventListener("contextmenu", e => e.preventDefault());

				// Mouse wheel event
				addEventListener("wheel", e => {
					if (!LAYERS.inventory.visible && !LAYERS.pause.visible) {
						let prev_slot = selected_slot;
						selected_slot = e.deltaY > 0 ? (selected_slot < 8 ? ++selected_slot : 0) : (selected_slot > 0 ? --selected_slot : 8);

						update_hotbar_selector(prev_slot, selected_slot);
					}
				});

				// Mouse move event (only for the inventory layer)
				addEventListener("mousemove", e => {
					WINDOW.X = Math.ceil(e.clientX / scale) * scale;
					WINDOW.Y = Math.ceil(e.clientY / scale) * scale;
				});

				LAYERS.inventory.canvas.addEventListener("mousemove", hover_inventory_slots);
				LAYERS.inventory.canvas.addEventListener("mousemove", () => {
					/*if (LAYERS.flowing_item.visible) {
						LAYERS.flowing_item.canvas.style.left = `${WINDOW.X - 8 * scale}px`;
						LAYERS.flowing_item.canvas.style.top = `${WINDOW.Y - 8 * scale}px`;
					}*/
				});

				// Left click event (only for the inventory layer)
				/*LAYERS.inventory.canvas.addEventListener("mousedown", e => {
					let slot = LAYERS.inventory.components.player_inventory.get_slot_at(WINDOW.X, WINDOW.Y);
					if (slot) {
						if (flowing_item) place_item(slot);
						else if (slot.item) take_item(slot);
					}
				});*/

				// Initialize tooltips
				// Tooltip.init();

				LAYERS.inventory.components.player_inventory.slots[26].assign(bread);
				Slots.hotbar[7].assign(cooked_beef);
				Slots.hotbar[8].assign(pumpkin_pie);
			});
		})
		.catch(error => console.error(error));
})();