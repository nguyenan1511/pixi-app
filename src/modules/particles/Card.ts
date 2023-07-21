/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

import gsap, { Sine } from "gsap";
import { Container } from "pixi.js";
import * as PIXI from "pixi.js";

export default class Card extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };
	}

	props: any;

	card: PIXI.Sprite | any;

	light: PIXI.Sprite | any;

	graphics: PIXI.Sprite | any;

	async awake() {
		// Get data app
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		const { renderer } = app;

		const texture = await PIXI.Texture.fromURL("/assets/images-webp/main-card.webp");

		if (!texture) return;
		this.card = PIXI.Sprite.from(texture);

		this.card.anchor.set(0.5);
		this.addChild(this.card);
		//   Graphics

		this.graphics = new PIXI.Graphics();
		this.graphics.beginFill(0xde3249);
		this.graphics.drawRect(0, 0, this.card.width, this.card.height);
		this.graphics.endFill();

		this.graphics.pivot.set(this.card.width / 2, this.card.height / 2);

		this.addChild(this.graphics);

		const textureLight = await PIXI.Texture.fromURL("/assets/images/lightSweet-1.png");
		// const textureLight = await PIXI.Texture.fromURL("/assets/images/lightSweet.png");
		if (!textureLight) return;

		this.light = PIXI.Sprite.from(textureLight);
		this.light.tint = "#F8F6F0";
		this.addChild(this.light);
		this.light.anchor.set(0.5);

		this.light.rotation = -0.5;
		this.light.alpha = 0.7;
		this.light.scale.y = 0.4;

		this.light.x = renderer.width / 2;
		this.light.y = -renderer.height / 2;

		gsap.to(this.light, {
			//
			duration: 2,
			x: -renderer.width / 2,
			y: renderer.height / 2,
			yoyo: true,
			repeat: -1,
			ease: Sine.easeInOut,
		});

		this.light.mask = this.graphics;

		const ev = { resize: "resizeCanvas" } as any;

		stage.on(ev.resize, this.resize.bind(this));

		this.resize({ width: renderer.width, height: renderer.height });
	}

	resize(e: any) {
		const { width, height } = e;
		const _height = height / 2.2;
		if (height <= width) {
			this.card.width = _height;
			this.card.height = (_height * 625) / 409;

			this.graphics.width = _height;
			this.graphics.height = (_height * 625) / 409;

			this.light.width = _height + 100;
			this.light.height = (_height * 625) / 409 + 100;
		} else {
			const _width = width / 2.2;

			this.card.width = _width;
			this.card.height = (_width * 625) / 409;

			this.graphics.width = _width;
			this.graphics.height = (_width * 625) / 409;

			this.light.width = _width + 100;
			this.light.height = (_width * 625) / 409 + 100;
		}
	}

	animate() {}
}
