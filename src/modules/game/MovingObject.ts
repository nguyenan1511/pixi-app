import { Event } from "diginext-pixi";
import { randomElement } from "diginext-utils/dist/array";
import { distance2Point, randFloat } from "diginext-utils/dist/math";

import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export default class MovingObject extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };

		this.awake();
	}

	parentMain!: PIXI.Container;

	canHit = true;

	list!: Array<string>;

	DISTANCE_HIT = 50;

	isStop = false;

	props: any;

	sprite = new PIXI.Sprite();

	speed = randFloat(5, 10);

	speedRotation = randFloat(0.0013, 0.0016);

	direction = 1;

	awake() {
		//

		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		stage.on(Event.RESIZE as any, this.resize.bind(this));

		this.addChild(this.sprite);

		this.sprite.anchor.set(0.5, 0.5);

		this.reset();
		// app.ticker.add(this.update.bind(this));
	}

	async changeTexture(url: string) {
		//

		const texture = await PIXI.Texture.fromURL(url);
		if (!texture) return;

		this.sprite.texture = texture;
	}

	reset() {
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const renderer = app.renderer as PIXI.Renderer;
		if (!renderer) return;

		if (!this.list) return;

		this.isStop = false;

		if (this.parentMain) this.parentMain.addChild(this);

		this.speed = randFloat(1, 3);
		this.speedRotation = randFloat(0.0013, 0.0016);

		this.sprite.scale.set(randFloat(0.2, 0.3));

		const randomTexture = randomElement(this.list);
		this.changeTexture(randomTexture);

		this.y = randFloat((renderer.height / renderer.resolution) * 0.5, (renderer.height / renderer.resolution) * 0.86);

		this.direction = Math.random() < 0.5 ? 1 : -1;

		if (this.direction > 0) {
			this.x = -randFloat(0, (renderer.width / renderer.resolution) * 2);
		} else {
			//
			this.x = randFloat(renderer.width / renderer.resolution, (renderer.width / renderer.resolution) * 2);
		}
	}

	onHit() {
		this.isStop = true;

		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		stage.emit("hit_object" as any, { item: this });
		//
	}

	resize({ data }: any) {
		console.log("🚀data---->", data);
	}

	update(_d: any) {
		//

		const app = (window as any).uData?.app as any;
		if (!app) return;

		const renderer = app.renderer as PIXI.Renderer;
		if (!renderer) return;

		if (this.isStop && this.canHit) return;

		if (this.direction < 0) if (this.x < -50) this.reset();
		if (this.direction > 0) if (this.x > renderer.width / renderer.resolution + 50) this.reset();
		this.x += this.speed * this.direction;

		this.rotation = Math.sin(+new Date() * this.speedRotation) * 0.6;

		const hook = (window as any).uData?.hook;

		const pos = hook.getGlobalPosition();

		const dis = distance2Point(pos.x, pos.y, this.x, this.y);

		if (dis < this.DISTANCE_HIT) {
			this.onHit();
		}

		// console.log("dis :>> ", dis);
		// console.log("        (window as any).uData?.hook?.position :>> ", (window as any).uData?.hook?.position);
		// this.x = (renderer.width / renderer.resolution) * 0.5;
		// this.y = (renderer.height / renderer.resolution) * 0.5;
	}
}
