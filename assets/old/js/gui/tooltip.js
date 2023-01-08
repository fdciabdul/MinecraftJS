const Tooltip = {
	element: document.createElement("div"),
	value: "",
	x: 0,
	y: 0,
	visible: false,
	print: function(value) {
		this.value = value;
		this.element.innerHTML = this.value;
	},
	move: function(x, y) {
		this.x = x;
		this.y = y;
		this.element.style.left = `${this.x + 18}px`;
		this.element.style.top = `${this.y - 30}px`;
	},
	toggle: function(state = !this.visible) {
		this.visible = state;
		this.element.style.visibility = this.visible ? "visible" : "hidden";
	},
};

// Tooltip DOM
Tooltip.element.className = "tooltip";
document.body.appendChild(Tooltip.element);
Tooltip.toggle(0);

addEventListener("mousemove", e => {
	// The tooltip is visible only on container layer slots
	if (ContainerLayer.visible) {
		const slot = Slot.getSlotAt(e);
		if (slot && slot.item && !selectedItem) {
			Tooltip.print(slot.item.name);
			Tooltip.move(e.clientX, e.clientY);
			Tooltip.toggle(1);
		} else Tooltip.toggle(0);
	}
});