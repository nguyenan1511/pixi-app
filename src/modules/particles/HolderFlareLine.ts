/* eslint-disable no-await-in-loop */

import { Container } from "pixi.js";
import * as PIXI from "pixi.js";

import FlareLine from "./FlareLine";
import scaleFull from "../../plugins/helper/scaleFull";

export default class HolderFlareLine extends Container {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };
  }

  props: any;

  holderFlareLineWrap: any;

  AMOUNT = 15;

  async awake() {
    // get Dataa App
    const app = (window as any).uData?.app as any;
    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;

    const { renderer } = app;

    // HolderWrap
    this.holderFlareLineWrap = new PIXI.Container();

    for (let i = 0; i < this.AMOUNT; i += 1) {
      const flareLine = new FlareLine();
      await flareLine.awake();
      this.holderFlareLineWrap.addChild(flareLine);
      flareLine.rotation = Math.PI * 2 * (i / this.AMOUNT - 1);
    }
    this.addChild(this.holderFlareLineWrap);

    const ev = { resize: "resizeCanvas" } as any;

    stage.on(ev.resize, this.resize.bind(this));

    this.resize({ width: renderer.width, height: renderer.height });
  }

  resize(e: any) {
    const { width, height } = e;
    scaleFull(this.holderFlareLineWrap, width / 1.3, height / 1.3);
  }

  animate(delta: number) {
    //
    this.holderFlareLineWrap.children.forEach((item: any) => {
      const t = Math.random() + delta;
      if (item.animate) item.animate(t, delta);
    });
  }
}
