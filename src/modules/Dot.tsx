import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export default class Dot extends Container {
	constructor(props?: any) {
		super();

		this.props = { ...this.props, ...props };
	}

	props: any;

	async setUp() {
		const width = window.innerWidth / 4;

		const textureDot = await PIXI.Texture.fromURL("/assets/images/dot.png");
		const dot = PIXI.Sprite.from(textureDot);

		dot.width = width;
		dot.height = (width * 178) / 201;
		// dot.anchor.set(0.5, 0);

		this.addChild(dot);
		// move the sprite to the center of the screen
	}
}
