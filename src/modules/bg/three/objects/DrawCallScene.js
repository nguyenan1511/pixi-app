import Object3DExtend from "diginext-three/dist/core/Object3DExtend";
import AppEvent from "diginext-three/dist/data/AppEvent";
import * as THREE from "three";

export default class DrawCallScene extends Object3DExtend {
	constructor(props) {
		super(props);

		Object.assign(this, props);

		this.#awake();
	}

	maxParticleCount = 1000;

	particleCount = 500;

	r = 1800;

	rHalf = this.r / 2;

	particlesData = [];

	particles = new THREE.BufferGeometry();

	particlePositions;

	particleScale;

	positions;

	colors;

	linesMesh;

	pointCloud;

	effectController = {
		showDots: true,
		showLines: true,
		minDistance: 150,
		limitConnections: false,
		maxConnections: 40,
		particleCount: 500,
	};

	point = new THREE.Vector3();

	#vertexshader = `
    attribute float size;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size;
      gl_Position = projectionMatrix * mvPosition;
    }
    `;

	#fragmentshader = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `;

	async #awake() {
		const scope = this;

		let particles = this.particles;
		const particlesData = this.particlesData;
		const maxParticleCount = this.maxParticleCount;
		let particleCount = this.particleCount;
		const r = this.r;
		const rHalf = this.rHalf;

		const segments = maxParticleCount * maxParticleCount;

		this.positions = new Float32Array(segments * 3);
		this.colors = new Float32Array(segments * 3);

		// const map = (await assetLoader(asset("/assets/images-webp/textures/glow1.webp"))) as THREE.Texture;

		const pMaterial = new THREE.ShaderMaterial({
			uniforms: {
				size: {
					value: [],
				},
			},
			vertexShader: this.#vertexshader,
			fragmentShader: this.#fragmentshader,
			transparent: true,
			depthWrite: false,
			// depthTest: false,
			// opacity: 0.4,
			blending: THREE.AdditiveBlending,
		});

		this.particlePositions = new Float32Array(maxParticleCount * 3);
		this.particleScale = new Float32Array(maxParticleCount * 1);

		for (let i = 0; i < maxParticleCount; i++) {
			const x = Math.random() * r - r / 2;
			const y = Math.random() * r - r / 2;
			const z = Math.random() * 700;

			this.particlePositions[i * 3] = x;
			this.particlePositions[i * 3 + 1] = y;
			this.particlePositions[i * 3 + 2] = z;

			this.particleScale[i] = 3;

			// add it to the geometry
			particlesData.push({
				velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
				scale: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
				numConnections: 0,
			});
		}

		particles.setDrawRange(0, particleCount);
		particles.setAttribute(
			"position",
			new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage)
		);
		particles.setAttribute("size", new THREE.BufferAttribute(this.particleScale, 1));

		// create the particle system
		this.pointCloud = new THREE.Points(particles, pMaterial);
		this.add(this.pointCloud);

		const geometry = new THREE.BufferGeometry();

		geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
		geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3).setUsage(THREE.DynamicDrawUsage));

		geometry.computeBoundingSphere();

		geometry.setDrawRange(0, 0);

		const material = new THREE.LineBasicMaterial({
			vertexColors: true,
			blending: THREE.AdditiveBlending,
			transparent: true,
		});

		this.linesMesh = new THREE.LineSegments(geometry, material);
		this.add(this.linesMesh);

		const uData = window.uData;
		if (!uData) return;

		const { scene, sw, sh } = uData;
		if (!scene) return;

		scene.addEventListener(AppEvent.RESIZE, this.resize.bind(this));
		this.resize({ sw, sh });

		this.#startUpdate();
	}

	resize(e) {
		const { sw, sh } = e;

		this.r = sw * 1.2;

		// this.effectController.minDistance = sw * 0.1 < 10 ? 10 : sw * 0.1;
	}

	update(delta, point) {
		//
		this.point.copy(point);
	}

	#updateBindThis;

	#updateLocal(e) {
		const { delta, time } = e;

		let vertexpos = 0;
		let colorpos = 0;
		let numConnected = 0;

		const maxParticleCount = this.maxParticleCount;
		let particleCount = this.particleCount;
		const r = this.r;
		const rHalf = this.rHalf;
		const particlesData = this.particlesData;
		const particlePositions = this.particlePositions;
		const particleScale = this.particleScale;
		const positions = this.positions;
		const linesMesh = this.linesMesh;
		const pointCloud = this.pointCloud;

		const effectController = this.effectController;

		for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

		for (let i = 0; i < particleCount; i++) {
			// get the particle
			const particleData = particlesData[i];

			particlePositions[i * 3] += particleData.velocity.x;
			particlePositions[i * 3 + 1] += particleData.velocity.y;
			particlePositions[i * 3 + 2] += particleData.velocity.z;

			particleScale[i] = 0;

			const _dir = this.point.distanceTo(new THREE.Vector3(particlePositions[i * 3], particlePositions[i * 3 + 1], 0));

			if (_dir < effectController.minDistance * 1.5) {
				particleScale[i] = 4;
			} else {
				particleScale[i] = 0;
			}

			if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
				particleData.velocity.y = -particleData.velocity.y;

			if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
				particleData.velocity.x = -particleData.velocity.x;

			if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
				particleData.velocity.z = -particleData.velocity.z;

			if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) continue;

			// Check collision
			for (let j = i + 1; j < particleCount; j++) {
				const particleDataB = particlesData[j];
				if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
					continue;

				const dx = particlePositions[i * 3] - particlePositions[j * 3];
				const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
				const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
				const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (dist < effectController.minDistance && _dir < effectController.minDistance * 1.5) {
					particleData.numConnections++;
					particleDataB.numConnections++;

					let alpha = 1.0 - dist / effectController.minDistance;

					positions[vertexpos++] = particlePositions[i * 3];
					positions[vertexpos++] = particlePositions[i * 3 + 1];
					positions[vertexpos++] = particlePositions[i * 3 + 2];

					positions[vertexpos++] = particlePositions[j * 3];
					positions[vertexpos++] = particlePositions[j * 3 + 1];
					positions[vertexpos++] = particlePositions[j * 3 + 2];

					this.colors[colorpos++] = alpha;
					this.colors[colorpos++] = alpha;
					this.colors[colorpos++] = alpha;

					this.colors[colorpos++] = alpha;
					this.colors[colorpos++] = alpha;
					this.colors[colorpos++] = alpha;

					numConnected++;
				}
			}
		}

		linesMesh.geometry.setDrawRange(0, numConnected * 2);
		linesMesh.geometry.attributes.position.needsUpdate = true;
		linesMesh.geometry.attributes.color.needsUpdate = true;

		pointCloud.geometry.attributes.position.needsUpdate = true;
		pointCloud.geometry.attributes.size.needsUpdate = true;
	}

	async #startUpdate() {
		const { uData } = window;
		if (!uData) return;

		const { scene } = uData;
		if (!scene) return;

		const AppEvent = (await import("diginext-three/dist/data/AppEvent")).default;

		this.#updateBindThis = this.#updateLocal.bind(this);

		this.addEventListener("dispose", () => {
			scene.removeEventListener(AppEvent.AFTER_RENDER, this.#updateBindThis);
		});

		scene.addEventListener(AppEvent.AFTER_RENDER, this.#updateBindThis);
	}
}
