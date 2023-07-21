import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export default class Card extends Container {
	constructor(props?: any) {
		super();

		this.props = { ...this.props, ...props };
	}

	props: any;

	async setUp() {
		const width = window.innerWidth / 3.5;

		const listImages = ["/assets/images-webp/flash1.webp", "/assets/images-webp/flash2.webp", "/assets/images-webp/flash3.webp"];
		const textureFlash = [];

		for (let i = 0; i < 3; i += 1) {
			const texture = {
				texture: PIXI.Texture.from(listImages[i] as string),
				time: 100,
			};
			textureFlash.push(texture);
		}

		const flashSprite = new PIXI.AnimatedSprite(textureFlash);

		flashSprite.animationSpeed = 1;
		flashSprite.play();

		const textureCard = await PIXI.Texture.fromURL("/assets/images-webp/main-card.webp");
		const card = PIXI.Sprite.from(textureCard);

		card.anchor.set(0.5);
		flashSprite.anchor.set(0.5);

		card.width = width;
		card.height = (width * 624) / 408;

		card.addChild(flashSprite);

		this.addChild(card);
		// move the sprite to the center of the screen
	}
}
