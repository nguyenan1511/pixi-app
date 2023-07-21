import { Container } from "pixi.js";
import * as PIXI from "pixi.js";

export default class Shirt extends Container {
	constructor(props?: any) {
		super();

		this.props = { ...this.props, ...props };
	}

	props: any;

	async setUp() {
		const skewStyle = new PIXI.TextStyle({
			fontFamily: "Arial",
			fill: ["#C40062"],
			fontSize: 30,
			fontWeight: "lighter",
		});

		const texture = await PIXI.Texture.fromURL("/assets/ShareElement/shirt.png");
		const shirt = PIXI.Sprite.from(texture);

		shirt.anchor.set(0.5);

		const skewText = new PIXI.Text("Dev Design", skewStyle);
		skewText.anchor.set(0.5);
		skewText.y = shirt.height / 2 - 60;

		const textureDesign = await PIXI.Texture.fromURL("/assets/ShareElement/design.png");
		const design = PIXI.Sprite.from(textureDesign);
		design.anchor.set(0.5);

		shirt.addChild(design);

		shirt.addChild(skewText);

		this.addChild(shirt);

		// move the sprite to the center of the screen
	}
}
