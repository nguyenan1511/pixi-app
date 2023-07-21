import { Container } from "pixi.js";
import * as PIXI from "pixi.js";

export default class FlareLine extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };

		// this.#awake();
	}

	flareLine: PIXI.Sprite | any;

	sum = 0;

	props: any;

	async awake() {
		const texture = await PIXI.Texture.fromURL("/assets/images/lightray.png");
		if (!texture) return;

		this.flareLine = PIXI.Sprite.from(texture);

		this.flareLine.anchor.y = 0.5;
		this.flareLine.tint = "#FDE699";

		this.addChild(this.flareLine);
	}

	animate(time: number, delta: number) {
		//
		this.sum += time;
		this.flareLine.scale.x = Math.sin(this.sum / 12) / 2 + 0.7;

		this.flareLine.alpha += delta / 50;
		if (this.flareLine.alpha >= 1) {
			this.flareLine.alpha = 0.3;
		}
	}
}
