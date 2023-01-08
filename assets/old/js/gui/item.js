/**
 * Construct a new item
 * @param {object}	item			Item data, such as:
 * @param {string}	item.name		Item name
 * @param {string}	item.texture	Item texture source (starts at /assets/textures/)
 */
function Item(item) {
	this.w = 8 * SETTINGS.ui_size;
	this.h = 8 * SETTINGS.ui_size;
	this.x = 0;
	this.y = 0;
	this.name = item.name;
	this.stack = 1;
	this.element = document.createElement("div");
	this.element.className = "item";
	this.element.style.cssText = `
		display: flex;
		justify-content: flex-end;
		align-items: end;
		width: ${this.w}px;
		height: ${this.h}px;
		margin: 2px;
		background-image: url(assets/textures/${item.texture});
		background-size: 100%;
		image-rendering: pixelated;
	`;
	this.setStack = count => {
		// Can't get more than 64 items in one slot
		if (count <= 64) this.stack = count;
		return this;
	};
	this.move = (x, y) => {
		this.x = x;
		this.y = y;
		this.element.style.left = `${this.x}px`;
		this.element.style.top = `${this.y}px`;
	};

	return this;
}

let selectedItem = undefined;
addEventListener("mousedown", e => {
	const slot = Slot.getSlotAt(e);
	if (!selectedItem) {
		// No pre-selected item
		if (slot && slot.item) {
			// Take item, drag & drop start
			// Tooltip.toggle();
			selectedItem = slot.item;
			slot.empty();
			selectedItem.element.style.position = "absolute";
			selectedItem.element.style.pointerEvents = "none";
			selectedItem.element.style.zIndex = 2;
			document.body.appendChild(selectedItem.element);

			selectedItem.move(e.clientX - selectedItem.w / 2, e.clientY - selectedItem.h / 2);
			addEventListener("mousemove", moveItemOnCursor);
		}
	} else {
		// Preselected item
		if (slot) {
			// Release item, drag & drop end
			if (slot.item) {
				// Swap items
				selectedItem = slot.swap(selectedItem);
				selectedItem.element.style.position = "absolute";
				selectedItem.element.style.pointerEvents = "none";
				selectedItem.element.style.zIndex = 2;
				document.body.appendChild(selectedItem.element);

				selectedItem.move(e.clientX - selectedItem.w / 2, e.clientY - selectedItem.h / 2);
				addEventListener("mousemove", moveItemOnCursor);
			} else {
				// Release item into this slot
				selectedItem.element.style.pointerEvents = "auto";
				selectedItem.element.remove();
				slot.assign(selectedItem);
				selectedItem = undefined;
				removeEventListener("mousemove", moveItemOnCursor);

				// Show tooltip after drag & drop end
				// Tooltip.print(slot.item.name);
				// Tooltip.move(e.clientX, e.clientY);
				// Tooltip.toggle();
			}
		}
	}
});

function moveItemOnCursor(e) {
	selectedItem.move(
		e.clientX - selectedItem.w / 2,
		e.clientY - selectedItem.h / 2,
	);
};



// Test itemss
const
	netherite_helmet = new Item({
		name: "Netherite Helmet",
		texture: "item/netherite_helmet.png",
	}),
	elytra = new Item({
		name: "Elytra", 
		texture: "item/elytra.png",
	}),
	netherite_leggings = new Item({
		name: "Netherite Leggings",
		texture: "item/netherite_leggings.png",
	}),
	netherite_boots = new Item({
		name: "Netherite Boots",
		texture: "item/netherite_boots.png",
	}),
	netherite_sword = new Item({
		name: "Netherite Sword",
		texture: "item/netherite_sword.png",
	}),
	bow = new Item({
		name: "Bow", 
		texture: "item/bow.png",
	}),
	netherite_pickaxe = new Item({
		name: "Netherite Pickaxe",
		texture: "item/netherite_pickaxe.png",
	}),
	ender_pearl = new Item({
		name: "Ender Pearl",
		texture: "item/ender_pearl.png",
	}),
	water_bucket = new Item({
		name: "Water Bucket",
		texture: "item/water_bucket.png",
	}),
	baked_potato = new Item({
		name: "Baked Potato",
		texture: "item/baked_potato.png",
	});

ContainerLayer.components.inventory.slots.armor[0].assign(netherite_helmet);
ContainerLayer.components.inventory.slots.armor[1].assign(elytra);
ContainerLayer.components.inventory.slots.armor[2].assign(netherite_leggings);
ContainerLayer.components.inventory.slots.armor[3].assign(netherite_boots);
ContainerLayer.components.inventory.slots.hotbar[0].assign(netherite_sword);
ContainerLayer.components.inventory.slots.hotbar[1].assign(bow);
ContainerLayer.components.inventory.slots.hotbar[2].assign(netherite_pickaxe);
ContainerLayer.components.inventory.slots.hotbar[6].assign(ender_pearl);
ContainerLayer.components.inventory.slots.hotbar[7].assign(water_bucket);
ContainerLayer.components.inventory.slots.hotbar[8].assign(baked_potato);
ContainerLayer.update();