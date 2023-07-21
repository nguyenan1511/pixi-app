import { Event } from "diginext-pixi";
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import FishMonster from "./FishMonster";
import FishEatable from "./FishEatable";

export default class MovingObjectHolder extends Container {
  constructor() {
    super();

    this.awake();
  }

  fish: any;

  MAX_FISH = 10;

  MAX_ENEMY = 1;

  async awake() {
    // get data app
    const app = (window as any).uData?.app as any;
    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;

    stage.on(Event.RESIZE as any, this.resize.bind(this));

    for (let index = 0; index < this.MAX_FISH; index = index + 1) {
      const item = new FishEatable();
      this.addChild(item);
      item.parentMain = this;
    }

    for (let index = 0; index < this.MAX_ENEMY; index = index + 1) {
      const item = new FishMonster();
      this.addChild(item);
    }

    // const pop = new BubblePop();
    // this.addChild(pop);
  }

  resize(e: any) {
    console.log("🚀e---->", e);
  }

  update(_dt: any) {
    //
    this.children.forEach((item: any) => {
      //
      if (item.update) item.update(_dt);
    });
  }
}
