const
	Scene = new THREE.Scene(),
	Renderer = new THREE.WebGLRenderer(),
	Camera = new THREE.PerspectiveCamera(90, innerWidth / innerHeight, .1, 1000),
	Controls = new THREE.PointerLockControls(Camera, document.body),
	Loader = new THREE.TextureLoader(),
	Entity = function(geometry) {
		this.mesh = new THREE.Group();
		this.texture = Array.from({length: 6}, () => "../../assets/textures/entity/illager/pillager.png")
			.map(t => {
				const map = Loader.load(t);
				map.magFilter = THREE.NearestFilter;
				return new THREE.MeshBasicMaterial({map: map});
			});
		this.bones = [];
		for (let b of geometry.bones) {
			if (!b.neverRender && (b.name === "head" || b.name === "nose")) {
				const uv = {
					head: [
						{x: b.cubes[0].size[0] / 64 * 2, y: 0.72},
						{x: 0, y: 0.72},
						{x: 0, y: 0},
						{x: 0, y: 0},
						{x: b.cubes[0].size[0] / 64, y: 0.72},
						{x: b.cubes[0].size[0] / 64 * 3, y: 0.73},
					],
					nose: [
						{x: 0, y: 0},
						{x: 0, y: 0},
						{x: 0, y: 0},
						{x: 0, y: 0},
						{x: 0, y: 0},
						{x: 0, y: 0},
					],
				};
				this.texture.forEach((f, i) => {
					f.map.repeat.set(
						b.cubes[0].size[0] / 64,
						Math.round(b.cubes[0].size[1] / 64 * 1000) / 1000 - .001,
					);
					f.map.offset = uv[b.name][i];
				});
				let bone = new THREE.Mesh(
					new THREE.BoxGeometry(b.cubes[0].size[0] / 16, b.cubes[0].size[1] / 16, b.cubes[0].size[2] / 16),
					this.texture,
				);
				bone.name = b.name;
				bone.position.set(b.cubes[0].origin[0] / 16, b.cubes[0].origin[1] / 16, b.cubes[0].origin[2] / 16);
				this.mesh.add(bone);
				console.log(bone.name, b.cubes[0].origin)
			}
		}
		Scene.add(this.mesh);
	},
	color_test = {
		head: 0xff5555,
		nose: 0xff55ff,
		body: 0xffff55,
		leftLeg: 0x000000,
		rightLeg: 0x000000,
		leftarm: 0x000000,
		rightarm: 0x000000,
	},
	loop = () => {
		update();
		Renderer.render(Scene, Camera);
		setTimeout(() => requestAnimationFrame(loop), fps_raw);
	},
	update = () => {
		keys.includes(Keybinds.walk_forwards)	&& Controls.moveForward(.1125);
		keys.includes(Keybinds.strafe_left)		&& Controls.moveRight(-.1125);
		keys.includes(Keybinds.walk_backwards)	&& Controls.moveForward(-.1125);
		keys.includes(Keybinds.strafe_right)	&& Controls.moveRight(.1125);
	},
	fps = 120,
	fps_raw = 1000 / fps,
	Keybinds = {
		strafe_left: "KeyA",
		strafe_right: "KeyD",
		walk_forwards: "KeyW",
		walk_backwards: "KeyS",
	},
	RESOURCES = ["../../assets/models/pillager.json"];
let keys = [],
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(1, 1, 1),
		new THREE.MeshBasicMaterial({color: "orange"})
	);






Camera.position.set(0, 1.8, .5);
Scene.add(Camera);
Renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(Renderer.domElement);
// Scene.add(cube);








Promise
	.all(RESOURCES.map(r => fetch(r).then(response => response.json())))
	.then(response => {
		const pillager = new Entity(response[0]["geometry.pillager"]);
		loop();
	})
	.catch(error => console.error(error));







addEventListener("click", () => Controls.lock());
addEventListener("resize", () => {
	Renderer.setSize(innerWidth, innerHeight);
	Camera.aspect = innerWidth / innerHeight;
	Camera.updateProjectionMatrix();
});
addEventListener("keydown", e => keys.push(e.code));
addEventListener("keyup", e => {
	const newKeys = [];
	keys.forEach(key => {key !== e.code && newKeys.push(key)});
	keys = newKeys;
});