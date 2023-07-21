/* eslint-disable class-methods-use-this */
import { Container } from "pixi.js";
import * as PIXI from "pixi.js";

function randomInRange(n: number) {
	let result = Math.floor(Math.random() * (2 * n - 1)) - n + 1;
	while (result === 0) {
		result = Math.floor(Math.random() * (2 * n - 1)) - n + 1;
	}
	return result;
}

export default class Dot extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };
		this.awake();
	}

	props: any;

	speed = 5;

	velocity = {
		x: this.speed,
		y: this.speed,
	};

	async awake() {
		// get data app

		// load
		const texture = await PIXI.Texture.fromURL("/assets/images/glow1.png");
		if (!texture) return;

		const dotImg = PIXI.Sprite.from(texture);

		dotImg.anchor.set(0.5);

		this.addChild(dotImg);

		// dotImg.tint = "#FCC201";
		dotImg.width = 60;
		dotImg.height = 60;

		this.reset();
	}

	reset() {
		this.velocity.x = randomInRange(this.speed);
		this.velocity.y = randomInRange(this.speed);

		// this.scale.set(Math.random());
		this.alpha = Math.random();

		this.x = 0;
		this.y = 0;
	}

	animate(delta: number) {
		// get data App
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const { renderer } = app;
		if (!renderer) return;

		const { width, height } = renderer;

		if (Math.abs(this.x) > width / 2 || Math.abs(this.y) > height / 2) {
			this.reset();
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.alpha += delta / 50;
	}
}
