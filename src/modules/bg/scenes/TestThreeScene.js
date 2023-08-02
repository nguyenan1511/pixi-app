import Object3DExtend from "diginext-three/dist/core/Object3DExtend";
import AppEvent from "diginext-three/dist/data/AppEvent";
import assetLoader from "diginext-three/dist/plugins/assetLoader";
import { isMobile } from "diginext-utils/dist/device";
import { rand, randFloat, randHalt } from "diginext-utils/dist/math";
import gsap, { Sine } from "gsap";
import * as THREE from "three";

import fragmentShader from "../three/glsl/fragment.glsl";
import vertexShader from "../three/glsl/vertex.glsl";
import DrawCallScene from "../three/objects/DrawCallScene";

export default class TestThreeScene extends Object3DExtend {
  constructor(props) {
    super(props);

    Object.assign(this, props);

    this.#awake();
  }

  scene1 = new THREE.Scene();

  mesh;

  pointer = new THREE.Vector2(1, -1);

  point = new THREE.Vector3();

  renderTarget;

  blobs = new Array();

  raycaster = new THREE.Raycaster();

  drawCallScene = new DrawCallScene();

  async #awake() {
    const scope = this;

    const uData = window.uData;
    if (!uData) return;

    const { scene, camera, controls, sw, sh, renderer } = uData;
    if (!scene) return;

    controls.setLookAt(0, 0, 1000, 0, 0, 0);
    controls.enabled = false;

    renderer.domElement.style.touchAction = "none"; // disable touch scroll

    this.renderTarget = new THREE.WebGLRenderTarget(sw, sh, {});

    if (isMobile()) {
      this.point.set(sw * 0.5 * 0.7, -sh * 0.5 * 0.3, 0);
    } else {
      this.point.set(sw * 0.5 * 0.7, -sh * 0.5 * 0.7, 0);
    }

    await Promise.all([
      //
      this.addObjects(),
      this.addBlobs(),
      this.addLine(),
    ]);

    this.#startUpdate();

    scene.addEventListener(AppEvent.RESIZE, (e) => {
      const { sw, sh } = e;

      if (this.mesh)
        if (this.mesh?.material?.uniforms?.time) {
          this.mesh.material.uniforms.resolution.value.x = sw;
          this.mesh.material.uniforms.resolution.value.y = sh;
          this.mesh.material.uniforms.resolution.value.z = 1;
          this.mesh.material.uniforms.resolution.value.w = sw / sh;
        }
      this.mesh?.scale?.set?.(sw, sh, 1);

      this.renderTarget?.setSize(sw, sh);
    });

    document.body.addEventListener(
      "pointermove",
      this.onPointerDown.bind(this)
    );
    document.body.addEventListener(
      "pointerdown",
      this.onPointerDown.bind(this)
    );
  }

  onPointerDown(e) {
    const { clientX, clientY } = e;

    const uData = window.uData;
    if (!uData) return;

    const { scene, renderer, camera } = uData;
    if (!scene) return;

    if (!renderer) return;
    const rect = renderer?.domElement?.getBoundingClientRect?.();
    if (!rect) return;

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = (-(clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, camera);
    const inter = this.raycaster.intersectObjects([this.mesh]);
    if (inter[0]) {
      this.point.copy(inter[0].point);
    }
  }

  async addBlobs() {
    //

    const map = await assetLoader("/assets/texture/textures/glow1.png");

    const MAX = isMobile() ? 30 : 50;
    const SIZE = isMobile() ? 500 : 800;
    const MIN_R = isMobile() ? 10 : 10;
    const MAX_R = isMobile() ? 120 : 200;
    const SPEED = () => {
      return isMobile() ? randHalt(0.04) : randHalt(0.07);
    };

    const geometry = new THREE.PlaneGeometry(SIZE, SIZE);
    const material = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      opacity: 0.8,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = 0.2;
    // this.add(plane);

    for (let i = 0; i < MAX; i++) {
      const b = plane.clone();

      b.userData.init = () => {
        const theta = randFloat(0, 2 * Math.PI);
        const r = randFloat(MIN_R, MAX_R);
        b.position.x = r * Math.sin(theta);
        b.position.y = r * Math.cos(theta);

        b.userData.speed = SPEED();
      };

      b.userData.init();

      b.position.x += this.point.x;
      b.position.y += this.point.y;

      b.userData.life = rand(2 * Math.PI);
      this.blobs.push(b);
      this.scene1.add(b);
    }

    this.scene1.scale.setScalar(5);
    gsap.to(this.scene1.scale, {
      duration: 1.2,
      x: 1,
      y: 1,
      z: 1,
      ease: Sine.easeOut,
    });
  }

  upadteBlobs() {
    //
    const uData = window.uData;
    if (!uData) return;

    const { scene, sw, sh } = uData;
    if (!scene) return;

    this.blobs.forEach((b) => {
      b.userData.life += b.userData.speed;
      // b.userData.life *= 1.01;
      b.scale.setScalar(Math.sin(b.userData.life));

      if (Math.abs(b.userData.life) > 1 * Math.PI) {
        //
        b.userData.life = -1 * Math.PI;
        b.userData.init();
        b.position.x += this.point.x;
        b.position.y += this.point.y;
      }
    });
  }

  async addLine() {
    //
    this.scene1.add(this.drawCallScene);
  }

  async addObjects() {
    const uData = window.uData;
    if (!uData) return;

    const { scene, controls, sw, sh, renderer } = uData;
    if (!scene) return;

    const maskT = await assetLoader("/assets/texture/textures/glow1.png");

    // Shader Material
    const shaderMaterial = new THREE.ShaderMaterial({
      // extensions: {
      // 	derivatives: "#extension GL_OES_standard_derivatives : enable",
      // 	// derivatives: true,
      // },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        // resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        resolution: {
          value: new THREE.Vector4(sw, sh, 1, sw / sh),
        },
        time: { value: 0.0 },
        mask: {
          value: maskT,
        },
      },
      transparent: true,
    });

    // public/assets/images-webp/textures/glow1.webp
    // Create a mesh with the shader material
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shaderMaterial);

    // Add the mesh to the scene
    this.add(this.mesh);
    this.mesh?.scale?.set?.(sw, sh, 1);
  }

  #updateBindThis;

  #updateLocal(e) {
    if (!this.renderTarget) return;
    if (!this.mesh) return;
    if (!this.mesh?.material?.uniforms?.time) return;

    const { delta, time, camera } = e;
    const renderer = e.renderer;

    this.mesh.material.uniforms.time.value += delta;

    this.upadteBlobs();

    this.drawCallScene.update(delta, this.point);

    renderer.setRenderTarget(this.renderTarget);
    renderer.render(this.scene1, camera);
    this.mesh.material.uniforms.mask.value = this.renderTarget.texture;
    renderer.setRenderTarget(null);
  }

  async #startUpdate() {
    const { uData } = window;
    if (!uData) return;

    const { scene } = uData;
    if (!scene) return;

    const AppEvent = (await import("diginext-three/dist/data/AppEvent"))
      .default;

    this.#updateBindThis = this.#updateLocal.bind(this);

    this.addEventListener("dispose", () => {
      scene.removeEventListener(AppEvent.BEFORE_RENDER, this.#updateBindThis);
    });

    scene.addEventListener(AppEvent.BEFORE_RENDER, this.#updateBindThis);
  }
}
