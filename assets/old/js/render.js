const render = () => {
	// Attach raycaster to the current camera
	Raycaster.setFromCamera(Pointer, Camera);

	let intersection = Raycaster.intersectObject(instancedChunk);

	// Check if the raycast intersects with something near
	if (intersection[0] !== undefined && intersection[0].distance < selectionDistance) {
		Selector.visible = true;
		let pos = intersection[0].point,
			materialIndex = intersection[0].face.materialIndex,
			x = Math.round(pos.x / u) * u,
			y = Math.round(pos.y / u) * u,
			z = Math.round(pos.z / u) * u,
			inc = (materialIndex % 2 != 0) ? u / 2 : -(u / 2);

		// Update selector position
		switch (materialIndex) {
			case 0:
			case 1:
				// Right, left
				x = pos.x + inc;
				break;
			case 2:
			case 3:
				// Top, bottom
				y = pos.y + inc;
				break;
			case 4:
			case 5:
				// Front, back
				z = pos.z + inc;
				break
		}
		Selector.position.x = x;
		Selector.position.y = y;
		Selector.position.z = z;
	} else Selector.visible = false;

	// Render the scene
	HUDRenderer.render(HUDScene, HUDCamera);
	Renderer.render(Scene, Camera);
}