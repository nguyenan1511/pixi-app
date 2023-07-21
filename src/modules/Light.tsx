import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export default class Light extends Container {
	constructor(props?: any) {
		super();

		this.props = { ...this.props, ...props };
	}

	props: any;

	async setUp() {
		const width = window.innerWidth;
		const textureLight = await PIXI.Texture.fromURL("/assets/images-webp/light.webp");
		const light = PIXI.Sprite.from(textureLight);

		light.anchor.set(0.5);

		light.width = width;
		light.height = (width * 624) / 408;

		this.addChild(light);

		// move the sprite to the center of the screen
	}
}
