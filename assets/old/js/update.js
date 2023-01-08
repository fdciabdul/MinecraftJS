const update = () => {
	switch (true) {
		default:
			if (!ContainerLayer.visible) {
				// Control keys
				if (keys.includes(Keybinds.walk_forwards)) Controls.moveForward(movingSpeed);
				if (keys.includes(Keybinds.strafe_left)) Controls.moveRight(-movingSpeed);
				if (keys.includes(Keybinds.walk_backwards)) Controls.moveForward(-movingSpeed);
				if (keys.includes(Keybinds.strafe_right)) Controls.moveRight(movingSpeed);
				if (keys.includes(Keybinds.jump) && Player.canJump) {
					Player.canJump = false;
					ySpeed = -1;
				}

				// Hotbar slots
				for (let i in Keybinds.hotbar_slots) {
					if (keys.includes(Keybinds.hotbar_slots[i])) {
						// Remove key from keylist
						keys.splice(i, 1);

						// Update selector position on the hotbar
						selected_slot = i;
						HUDLayer.components.selector.setPosition([
							-160 + selected_slot * 40,
							HUDLayer.components.selector.origin.y,
						]);
						HUDLayer.update();
					}
				}
			}

			break;

		// Escape key
		case keys.includes(Keybinds.escape):
			// Remove key from keylist
			keys.splice(keys.indexOf(Keybinds.escape), 1);

			if (ContainerLayer.visible) {
				// Hide container layer if visible
				ContainerLayer.components.inventory.toggle(0);
				ContainerLayer.toggle(0);
				// Tooltip.toggle(0);

				setTimeout(() => {Controls.lock()}, 300);
			} else {
				// Toggle pause menu layer display
				MenuLayer.visible ? Controls.unlock() : Controls.lock();
				MenuLayer.toggle();
			}

			break;

		// Toggle HUD key
		case keys.includes(Keybinds.toggle_hud):
			// Remove key from keylist
			keys.splice(keys.indexOf(Keybinds.toggle_hud), 1);

			// Toggle HUD display
			HUDLayer.toggle();
			CrosshairLayer.toggle();

			break;

		// Toggle inventory key
		case keys.includes(Keybinds.open_inventory):
			// Remove key from keylist
			keys.splice(keys.indexOf(Keybinds.open_inventory), 1);

			if (!MenuLayer.visible) {
				ContainerLayer.components.inventory.toggle();
				ContainerLayer.toggle();
				// Tooltip.toggle(ContainerLayer.visible);

				ContainerLayer.visible ? Controls.unlock() : Controls.lock();
			}

			break;
	}

	// Player gravity
	Camera.position.y -= ySpeed / 4;
	ySpeed += acc;

	for (let chunk of chunks) {
		for (let block of chunk) {
			if (
				Camera.position.x <= block.x + (u / 2) &&
				Camera.position.x >= block.x - (u / 2) &&
				Camera.position.y <= block.y + (u * 2.12) &&
				Camera.position.y >= block.y &&
				Camera.position.z <= block.z + (u / 2) &&
				Camera.position.z >= block.z - (u / 2)
			) {
				Camera.position.y = block.y + (u * 2.12);
				ySpeed = 0;
				Player.canJump = true;
			}
		}
	}

	// Terrain generation
	const
		worldWide	= chunkSize * renderDistance * u,
		ratio		= .4;
	if (Camera.position.z <= getBlock("lowest", "z") + worldWide * ratio) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i in chunks) {
			if ((i + 1) % renderDistance != 0) {
				newChunks.push(chunks[i]);
			}
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let x = lowestX + (i * chunkSize * u);
				x < lowestX + ((i + 1) * chunkSize * u);
				x += u
			) {
				for (
					let z = lowestZ - (chunkSize * u);
					z < lowestZ;
					z += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z));
				}
			}
			newChunks.splice(i * renderDistance, 0, chunk);
		}

		chunks = newChunks;

		Scene.remove(instancedChunk);

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance),
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z,
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++;
			})
		});
		Scene.add(instancedChunk);
	}

	if (Camera.position.z >= getBlock("highest", "z") - worldWide * ratio) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i in chunks) {
			if (i % renderDistance != 0) {
				newChunks.push(chunks[i]);
			}
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			highestZ = getBlock("highest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let x = lowestX + (i * chunkSize * u);
				x < lowestX + ((i + 1) * chunkSize * u);
				x += u
			) {
				for (
					let z = highestZ + u;
					z < (highestZ + u) + (chunkSize * u);
					z += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z));
				}
			}
			newChunks.splice((i + 1) * renderDistance - 1, 0, chunk);
		}

		chunks = newChunks;

		Scene.remove(instancedChunk);

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance),
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z,
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++;
			})
		});
		Scene.add(instancedChunk);
	}

	if (Camera.position.x >= getBlock("highest", "x") - worldWide * ratio) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i = renderDistance; i < chunks.length; i++) {
			newChunks.push(chunks[i]);
		}

		// Add blocks
		let highestX = getBlock("highest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let z = lowestZ + (i * chunkSize * u);
				z < lowestZ + ((i + 1) * chunkSize * u);
				z += u
			) {
				for (
					let x = highestX + u;
					x < highestX + u + (chunkSize * u);
					x += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z));
				}
			}
			newChunks.splice(chunks.length - (renderDistance - i), 0, chunk);
		}

		chunks = newChunks;

		Scene.remove(instancedChunk);

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance),
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z,
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++;
			})
		});
		Scene.add(instancedChunk);
	}

	if (Camera.position.x <= getBlock("lowest", "x") + worldWide * ratio) {
		/*
			[0], [3], [6]
			[1], [x], [7]
			[2], [5], [8]
		*/

		let newChunks = [];

		// Add new chunks in front of the player
		for (let i = 0; i < chunks.length - renderDistance; i++) {
			newChunks.push(chunks[i]);
		}

		// Add blocks
		let lowestX = getBlock("lowest", "x"),
			lowestZ = getBlock("lowest", "z");
		for (let i = 0; i < renderDistance; i++) {
			let chunk = [];
			for (
				let z = lowestZ + (i * chunkSize * u);
				z < lowestZ + ((i + 1) * chunkSize * u);
				z += u
			) {
				for (
					let x = lowestX - (chunkSize * u);
					x < lowestX;
					x += u
				) {
					xOff = inc * x / u;
					zOff = inc * z / u;
					const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
					chunk.push(new Block(x, v, z));
				}
			}
			newChunks.splice(i, 0, chunk);
		}

		chunks = newChunks;

		Scene.remove(instancedChunk);

		instancedChunk = new THREE.InstancedMesh(
			BlockGeometry,
			BlockMaterial,
			(chunkSize * chunkSize * renderDistance * renderDistance),
		);
		let count = 0;
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				let matrix = new THREE.Matrix4().makeTranslation(
					block.x,
					block.y,
					block.z,
				);
				instancedChunk.setMatrixAt(count, matrix);
				count++;
			})
		});
		Scene.add(instancedChunk);
	}
}