/* eslint-disable no-await-in-loop */

import { Container } from "pixi.js";

import Dot from "./Dot";

export default class HolderDot extends Container {
	constructor(props?: any) {
		super();
		this.props = { ...this.props, props };

		// this.#awake();
	}

	props: any;

	AMOUNT = 12;

	async awake() {
		for (let i = 0; i < this.AMOUNT; i += 1) {
			//
			const dot = new Dot();

			await dot.awake();

			this.addChild(dot);
		}
	}

	animate(delta: number) {
		//
		this.children.forEach((item: any) => {
			if (item.animate) item.animate(delta);
		});
	}
}
