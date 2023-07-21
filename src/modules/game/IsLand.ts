import scaleByHeight from "diginext-pixi/dist/helper/scaleByHeight";
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export default class IsLand extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };
	}

	props: any;
  
	isLand: any;

	async awake() {
		// get data app
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		const { renderer } = app;

		const texture = await PIXI.Texture.fromURL("/images-webp/textures/game/island.webp");
		if (!texture) return;

		this.isLand = PIXI.Sprite.from(texture);

		this.addChild(this.isLand);
		const ev = { resize: "resizeCanvas" } as any;

		stage.on(ev.resize, this.resize.bind(this));
		this.resize({ width: renderer.width, height: renderer.height });
	}

	resize(e: any) {
		const { width, height } = e;

		if (!this.isLand) return;

		scaleByHeight(this.isLand, height * 0.2);

		this.isLand.y = height * 0.14;
		this.isLand.x = width - this.isLand.width;
		// this.isLand.x = width * 0.94;
	}
}
