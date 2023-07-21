import type * as PIXI from "pixi.js";
import MovingObject from "./MovingObject";

export default class FishEatable extends MovingObject {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };

    this.awake();
  }

  typeObj = "eatable";

  list = [
    //
    "/images-webp/textures/game/obj-1.webp",
    "/images-webp/textures/game/obj-2.webp",
    "/images-webp/textures/game/obj-3.webp",
    "/images-webp/textures/game/obj-4.webp",
    "/images-webp/textures/game/obj-5.webp",
    "/images-webp/textures/game/obj-6.webp",
    "/images-webp/textures/game/obj-7.webp",
    "/images-webp/textures/game/obj.webp",
  ];

  props: any;

  awake() {
    //
    const app = (window as any).uData?.app as any;
    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;
    //
  }
}
