import { Event } from "diginext-pixi";
import InteractItem from "diginext-pixi/dist/core/InteractItem";
import { randFloat } from "diginext-utils/dist/math";
import * as PIXI from "pixi.js";

export default class Hook extends InteractItem {
	constructor(props?: any) {
		super({ url: "/images-webp/textures/game/tool-fishing.webp" });
		this.props = { ...this.props, props };

		this.#awake();
	}

	holder = new PIXI.Container();

	isActive = false;

	props: any;

	#awake() {
		//
		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		this.addChild(this.holder);

		// this.holder.scale.x = 1 / this.scale.x;
		// this.holder.scale.y = 1 / this.scale.y;

		this.holder.scale.set(2);

		stage.on(Event.RESIZE as any, this.resize.bind(this));

		stage.on("hit_object" as any, this.onHit.bind(this));

		// app.ticker.add(this.update.bind(this));

		// typeObj
	}

	onHit(obj: any) {
		//
		const { item } = obj;

		const { typeObj } = item;

		if (typeObj == "eatable") {
			this.holder.addChild(item);
			item.x = randFloat(-10, 10);
			item.y = randFloat(-10, 10);
		}
	}

	resetObject() {
		for (let i = this.holder?.children?.length - 1; i >= 0; i--) {
			const item = this.holder?.children[i] as any;
			if (item?.reset) item.reset();
		}
	}

	releaseComplete() {
		//

		const app = (window as any).uData?.app as any;
		if (!app) return;

		const stage = app.stage as PIXI.Container;
		if (!stage) return;

		const score = this.holder?.children?.length;

		if (score > 0) stage.emit("hook-released-complete" as any, { data: { score } });

		this.resetObject();
	}

	resize({ data }: any) {
		console.log("🚀data---->", data);
		// const { width, height } = data;
	}

	update() {
		//
	}
}
