/**
 * Construct a new layer component
 * @param {object}	component			Component data, such as:
 * @param {string}	component.type		Component type
 * @param {string}	component.id		Component identifier
 * @param {array}	component.origin	Component position, [0] for X and [1] for Y
 * @param {array}	component.size		Component size, [0] for width and [1] for height
 * @param {string}	component.texture	Component texture source (starts at /assets/textures/)
 * @param {array}	component.uv		Component texture offset, [0] for X and [1] for Y
 * @param {boolean}	component.visible	Component visibility attribute, which the canvas uses to draw it or not
 * @param {array}	component.slots		Component slots to be displayed (only for container types)
 */
function InterfaceComponent(component) {
	this.type = component.type;
	this.id = component.id;
	this.visible = component.visible !== undefined ? component.visible : true;
	this.origin = {
		x: component.origin ? component.origin[0] : 0,
		y: component.origin ? component.origin[1] : 0,
	};
	this.size = {
		x: component.size ? component.size[0] : 0,
		y: component.size ? component.size[1] : 0,
	};
	this.texture = component.texture;
	this.uv = {
		x: component.uv ? component.uv[0] : 0,
		y: component.uv ? component.uv[1] : 0,
	};
	this.slots = this.type === "container" ? component.slots : undefined;

	this.setPosition = pos => {
		this.origin.x = pos[0];
		this.origin.y = pos[1];
	};
	this.toggle = (state = !this.visible) => {
		this.visible = state;
		if (this.type === "container" && this.slots) {
			for (let section of Object.values(this.slots)) {
				for (let slot of section) {
					slot.element.style.visibility = this.visible ? "visible" : "hidden";
				}
			}
		}
		this.layer.update();
	};

	switch (this.type) {
		case "container":
			break;
		case "text":
			this.text = component.text;
			console.log(this.text)
			break;
	}

	for (let section in this.slots) {
		for (let slot of this.slots[section]) {
			document.querySelector(".slots").append(slot.element);
		}
	}

	return this;
}

CrosshairLayer
	.add(
		new InterfaceComponent({
			type: "crosshair",
			id: "crosshair",
			origin: [0, 0],
			size: [18, 18],
			texture: "gui/icons.png",
			uv: [3, 3],
		}),
	)
	.update();

HUDLayer
	.add(
		new InterfaceComponent({
			type: "container",
			id: "hotbar",
			origin: [0, -(WINDOW_HEIGHT / 2) + 21],
			size: [364, 44],
			texture: "gui/widgets.png",
			uv: [0, 0],
			slots: {
				hotbar: Array.from({length: 9}, (_, i) => {
					return new Slot({
						type: "hotbar",
						x: -144 + i * 36,
						y: -133,
					});
				}),
			},
		}),
	)
	.add(
		new InterfaceComponent({
			id: "selector",
			origin: [-160, -(WINDOW_HEIGHT / 2) + 21],
			size: [48, 48],
			texture: "gui/widgets.png",
			uv: [0, 22],
		}),
	)
	.add(
		new InterfaceComponent({
			id: "experience_bar",
			origin: [0, -(WINDOW_HEIGHT / 2) + 52],
			size: [364, 10],
			texture: "gui/icons.png",
			uv: [0, 64],
		}),
	)
	.update();

ContainerLayer
	.add(
		new InterfaceComponent({
			type: "container",
			id: "inventory",
			origin: [0, 0],
			size: [352, 332],
			texture: "gui/container/inventory.png",
			uv: [0, 0],
			visible: false,
			slots: {
				armor: Array.from({length: 4}, (_, i) => {
					return new Slot({
						type: "armor",
						x: -144,
						y: 135 - i * 36,
					});
				}),
				shield: [
					new Slot({
						type: "shield",
						x: -6,
						y: 26,
					}),
				],
				inventory: Player.inventory,
				hotbar: Player.hotbar,
			},
		}),
	);