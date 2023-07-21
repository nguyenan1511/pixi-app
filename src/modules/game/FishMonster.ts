
import { randomElement } from "diginext-utils/dist/array";
import { randFloat } from "diginext-utils/dist/math";
import type * as PIXI from "pixi.js";
import MovingObject from "./MovingObject";

export default class FishMonster extends MovingObject {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };

		this.awake();
	}

	typeObj = "non-eatable";

	canHit = false;

	list = [
		//
		"/images-webp/textures/game/enemy-1.webp",
	];

	props: any;

	awake() {
		//
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		this.sprite.scale.set(0.5);
		//
	}

	reset() {
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const renderer = app.renderer as PIXI.Renderer;
		if (!renderer) return;

		if (!this.list) return;

		this.speed = randFloat(1.5, 3);

		const randomTexture = randomElement(this.list);
		this.changeTexture(randomTexture);

		this.y = (renderer.height / renderer.resolution) * 0.39;

		this.direction = Math.random() < 0.5 ? 1 : -1;

		if (this.direction > 0) {
			this.x = -randFloat(50, (renderer.width / renderer.resolution) * 1);
			this.scale.x = 1;
		} else {
			//
			this.x = randFloat(renderer.width / renderer.resolution + 50, (renderer.width / renderer.resolution) * 2);
			this.scale.x = -1;
		}
	}
}