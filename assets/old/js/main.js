// Set random Perlin noise seed for terrain generation
noise.seed(Math.random());

// Init Three.js objects
const loop = () => {
	// debug("pos", `XYZ: ${Camera.position.x.toFixed(3)} / ${Camera.position.y.toFixed(5)} / ${Camera.position.z.toFixed(3)}`);
	// debug("block", `Block: ${Camera.position.x.toFixed(0)} ${Camera.position.y.toFixed(0)} ${Camera.position.z.toFixed(0)}`);
	// debug("facing", `Facing: (${Camera.rotation.x.toFixed(1)} / ${Camera.rotation.y.toFixed(1)} / ${Camera.rotation.z.toFixed(1)})`);
	update();
	render();
	setTimeout(() => {requestAnimationFrame(loop)}, (1000 / fps))
};

let chunks	= [],
	keys	= [],
	ySpeed	= 0;

// Set sky color and fog
Scene.background = new THREE.Color(0x000000);
Scene.fog = new THREE.Fog(0x000000, fogBlend, fogDistance);

// Positionate camera
Camera.position.set(0, 10, 0);
Scene.add(Camera);

// Positionate pointer
Pointer.x = .5 * 2 - 1;
Pointer.y = -.5 * 2 + 1;

// Add outline to selector
Selector.add(SelectorOutline);
Scene.add(Selector);

// Generate chunks 
let instancedChunk = new THREE.InstancedMesh(
		BlockGeometry,
		BlockMaterial,
		(chunkSize * chunkSize * renderDistance * renderDistance),
	),
	count = 0;

for (let i = 0; i < renderDistance; i++) {
	for (let j = 0; j < renderDistance; j++) {
		let chunk = [];
		for (
			let x = (i * chunkSize);
			x < (i * chunkSize) + chunkSize;
			x++
		) {
			for (
				let z = (j * chunkSize);
				z < (j * chunkSize) + chunkSize;
				z++
			) {
				xOff = inc * x;
				zOff = inc * z;
				const v = Math.round(noise.perlin2(xOff, zOff) * amplitude / u) * u;
				chunk.push(new Block(x * u, v, z * u));
				let matrix = new THREE.Matrix4().makeTranslation(x * u, v, z * u);
				instancedChunk.setMatrixAt(count, matrix);
				count++;
			}
		}
		chunks.push(chunk);
	}
}
Scene.add(instancedChunk);

// Loop rendering and stats function
loop();