const
	HUDScene = new THREE.Scene(),
	HUDRenderer = new THREE.WebGLRenderer({alpha: true}),
	HUDCamera = new THREE.PerspectiveCamera(65, WINDOW_WIDTH / WINDOW_HEIGHT, .1, 1000),
	holdBlockMaterial = ([
		"spruce_planks",	// Right
		"spruce_planks",	// Left
		"spruce_planks",	// Top
		"spruce_planks",	// Bottom
		"spruce_planks",	// Front
		"spruce_planks",	// Back
	]).map(face => {
		const map = Loader.load(`assets/textures/block/${face}.png`);
		map.magFilter = THREE.NearestFilter;
		return new THREE.MeshBasicMaterial({map: map});
	}),
	holdBlock = new THREE.Mesh(new THREE.BoxGeometry(1.04, 1.04, 1.04), holdBlockMaterial);

// Set hold block position
holdBlock.position.set(1.46, -1.28, -1.88);

// Set hold block rotation
holdBlock.rotation.set(
	0,
	Math.PI / (Math.PI + 1) + .028,
	0,
);

// Customize renderer
HUDRenderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
HUDRenderer.setClearColor(0x000000, 0);

// Customize renderer DOm
HUDRenderer.domElement.className = "scene";
HUDRenderer.domElement.id = "hud";
document.body.append(HUDRenderer.domElement);

HUDScene.add(holdBlock);