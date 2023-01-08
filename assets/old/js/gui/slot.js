/**
 * Construct a slot which acts as an item container
 * @param {object} slot - Slot informations, such as id and position
 */
function Slot(slot) {
	this.id = lastSlotId++;
	this.type = slot.type;
	this.w = 9 * SETTINGS.ui_size;
	this.h = 9 * SETTINGS.ui_size;
	this.x = slot.x;
	this.y = slot.y;
	this.item = null;
	this.element = document.createElement("div");
	this.element.dataset.id = this.id;
	this.element.className = `slot ${lastSlotId}`;
	this.element.style.cssText = `
		visibility: hidden;
		width: ${this.w}px;
		height: ${this.h}px;
		position: absolute;
		left: ${WINDOW_WIDTH / 2 - (this.w / 2) + this.x}px;
		top: ${WINDOW_HEIGHT / 2 - (this.h / 2) - this.y}px;
	`;

	/**
	 * Assign an item to the slot. The previous item will be dropped.
	 * @param {object} item - The item to be assigned
	 */
	this.assign = item => {
		this.item = item;
		this.element.append(this.item.element);

		this.item.element.style.position = "static";
	};

	/**
	 * Assign an item to the slot and return the previous one.
	 * @param {object} item - The item to be assigned
	 */
	this.swap = item => {
		// Stock the previous item
		let previousItem = this.item;

		// Assign the new item
		this.assign(item);

		return previousItem;
	};

	/**
	 * Remove the current item from the slot.
	 */
	this.empty = () => {
		this.element.replaceChildren();
		this.item = null;
	};

	return this;
}

/**
 * Return the slot which has the same coordinates as the specified event target. If no slot is found, return False.
 * @param {object} e - The event object
 */
Slot.getSlotAt = e => {
	if (e.target.className.includes("slot")) {
		for (let part of Object.values(ContainerLayer.components.inventory.slots)) {
			for (let slot of part) {
				if (slot.id == e.target.dataset.id) return slot;
			}
		}
	}
	return false;
};

let lastSlotId = 0;