const
	Block = function(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		/*this.mesh;
		this.line;
		this.getVoxel = function(x, y, z) {
			let response = false;
			chunks.forEach(chunk => {
				chunk.forEach(block => {
					if (
						block.x == x &&
						block.y == y &&
						block.z == z
					) response = true
				})
			});
			return response
		};
		this.directions = [];
		this.adjustFaces = function() {
			for (const {dir} of Faces) {
				const neighbor = this.getVoxel(
					this.x + dir[0],
					this.y + dir[1],
					this.z + dir[2]
				);
				if (neighbor) this.directions.push(dir[3])
			}
		};
		this.display = function() {
			// Remove unwanted faces
			this.adjustFaces();

			// Create block
			this.mesh = new THREE.Mesh(BlockGeometry, [
				(this.directions.includes("right") ? null : BlockMaterial[0]),
				(this.directions.includes("left") ? null : BlockMaterial[1]),
				(this.directions.includes("top") ? null : BlockMaterial[2]),
				(this.directions.includes("bottom") ? null : BlockMaterial[3]),
				(this.directions.includes("front") ? null : BlockMaterial[4]),
				(this.directions.includes("back") ? null : BlockMaterial[5])
			]);
			this.mesh.position.x = this.x;
			this.mesh.position.y = this.y - 10;
			this.mesh.position.z = this.z;
			Scene.add(this.mesh);

			// Create block borders
			
			if (Settings.borders) {
				const BlockEdges = new THREE.EdgesGeometry(BlockGeometry);
				this.line = new THREE.LineSegments(BlockEdges, new THREE.LineBasicMaterial({color: 0xffff00}));
				Scene.add(this.line);
				this.line.position.x = this.x;
				this.line.position.y = this.y - 10;
				this.line.position.z = this.z
			}
		}*/
	},
	getBlock = (pos, axis) => {
		const map = [];
		chunks.forEach(chunk => {
			chunk.forEach(block => {
				map.push(block[axis])
			})
		});
		return pos === "lowest" ? Math.min.apply(null, map) : Math.max.apply(null, map)
	};