const Player = {
	canJump: true,
	hearts: 10,
	maxHealth: 20,
	health: 20,
	maxHunger: 20,
	hunger: 20,
	inventory: Array.from({length: 27}, (_, i) => {
		return new Slot({
			type: "inventory",
			x: -144 + (i % 9) * 36,
			y: -17 - Math.floor(i / 9) * 36,
		});
	}),
	hotbar: Array.from({length: 9}, (_, i) => {
		return new Slot({
			type: "hotbar",
			x: -144 + i * 36,
			y: -133,
		});
	}),
};