/* eslint-disable class-methods-use-this */
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

import BgOcean from "../game/BgOcean";
import IsLand from "../game/IsLand";
import scaleFull from "../../plugins/helper/scaleFull";
import moveToBottom from "../../plugins/helper/moveToBottom";
import Player from "../game/Player";
import MovingObjectHolder from "../game/MovingObjectHolder";

export default class GameScenes extends Container {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };
  }

  props: any;

  bg: PIXI.Sprite | any;

  holder: Container | any;

  bgOcean: any;

  wave1: any;

  wave2: any;

  player: any;

  isLand: any;

  fishHolder = new MovingObjectHolder();

  /* <-------  private  -------> */
  async awake() {
    const app = (window as any).uData?.app as any;

    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;

    const { renderer } = app;

    this.holder = new PIXI.Container();

    this.addChild(this.holder);

    /* <-------  bg  -------> */
    const texture = await PIXI.Texture.fromURL(
      "/images-webp/textures/game/sky.webp"
    );
    if (!texture) return;
    this.bg = PIXI.Sprite.from(texture);
    this.bg.anchor.set(0.5);
    this.addChild(this.bg);
    moveToBottom(this.bg);

    /* <-------  Ocean  -------> */
    const meshOcean = new BgOcean();
    this.bgOcean = await meshOcean.createMesh(
      "/images-webp/textures/game/bg.webp"
    );
    this.holder.addChild(this.bgOcean);

    /* <-------  Ocean wave2  -------> */
    const meshWave2 = new BgOcean();
    this.wave2 = await meshWave2.createMesh(
      "/images-webp/textures/game/bg-wave-2.webp"
    );
    this.holder.addChild(this.wave2);

    /* <-------  Ocean wave1  -------> */
    const meshWave1 = new BgOcean();
    this.wave1 = await meshWave1.createMesh(
      "/images-webp/textures/game/bg-wave-1.webp"
    );
    this.holder.addChild(this.wave1);

    /* <-------   IsLand  -------> */
    this.isLand = new IsLand();
    await this.isLand.awake();
    this.addChild(this.isLand);

    /* <-------   Player  -------> */
    this.player = new Player();
    await this.player.awake();

    this.addChild(this.player);

    /* <-------   Fish  -------> */

    this.addChild(this.fishHolder);

    const ev = { resize: "resizeCanvas" } as any;

    stage.on(ev.resize, this.resize.bind(this));

    this.resize({ width: renderer.width, height: renderer.height });

    app.ticker?.add((time: number) => {
      // deltaTime
      this.update(time);
    });
  }

  /* <-------  resize  -------> */
  resize(e: any) {
    const { width, height } = e;

    this.bg.x = width / 2;
    this.bg.y = height / 2;

    // // holder oceans
    scaleFull(this.bg, width, height);
  }

  /* <-------   update  -------> */
  update(d?: any) {
    //
    if (this.bgOcean) {
      this.bgOcean.shader.uniforms.time += d * 0.06;
    }
    if (this.wave1) {
      this.wave1.shader.uniforms.time += d * 0.07;
    }
    if (this.wave2) {
      this.wave2.shader.uniforms.time += d * -0.1;
    }
    this.player.update(d);

    this.fishHolder.update(d);
  }
}
