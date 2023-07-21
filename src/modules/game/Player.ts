import InteractItem from "diginext-pixi/dist/core/InteractItem";
import scaleByHeight from "diginext-pixi/dist/helper/scaleByHeight";
import gsap, { Sine } from "gsap";
import * as PIXI from "pixi.js";
import Hook from "./Hook";

export default class Player extends InteractItem {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };
  }

  props: any;

  player: any;

  wire: any;

  name = "player";

  holderRod: any;

  time = 0;

  rad = 0;

  isCatching = false;

  hook = new Hook();

  isStopRotate = false;

  get ROD_LENGTH() {
    const app = (window as any).uData?.app as any;
    if (!app) return 0;

    const renderer = app.renderer as PIXI.Renderer;
    if (!renderer) return 0;

    return (renderer.height / renderer.resolution) * 0.3;
  }

  get MAX_HEIGHT() {
    const app = (window as any).uData?.app as any;
    if (!app) return 0;

    const renderer = app.renderer as PIXI.Renderer;
    if (!renderer) return 0;

    return (renderer.height / renderer.resolution) * 0.85;
  }

  async awake() {
    // get data app
    const app = (window as any).uData?.app as any;

    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;

    const { renderer } = app;

    const texture = await PIXI.Texture.fromURL(
      "/images-webp/textures/game/char.webp"
    );
    if (!texture) return;

    this.holderRod = new PIXI.Container();

    this.player = PIXI.Sprite.from(texture);

    this.addChild(this.player);
    this.addChild(this.holderRod);

    // Wire
    this.wire = new PIXI.Graphics();
    this.wire.beginFill(0xffffff);
    this.wire.drawRect(0, 0, 4, 1);
    this.wire.endFill();
    this.wire.scale.y = this.ROD_LENGTH;

    this.holderRod.addChild(this.wire);

    //Hook
    this.hook.position.set(-3.9259336755865775, this.ROD_LENGTH + 12);
    this.hook.scale.set(0.4);

    this.holderRod.addChild(this.hook);

    (window as any).uData.hook = this.hook;

    const ev = { resize: "resizeCanvas", doCatch: "do_catch" } as any;

    stage.on(ev.resize, this.resize.bind(this));
    this.resize({ width: renderer.width, height: renderer.height });

    stage.on(ev.doCatch, this.doCatch.bind(this));
  }

  async doCatch(e: any) {
    if (this.isStopRotate) return;

    const app = (window as any).uData?.app as any;
    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;

    stage.emit("tha-neo-confirm" as any);

    this.isStopRotate = true;

    const duration = 1;

    const obj = {
      length: this.ROD_LENGTH,
    };
    await gsap.to(obj, {
      duration,
      length: this.MAX_HEIGHT,
      ease: Sine.easeInOut,
      onUpdate: () => {
        //
        this.changeLength(obj.length);
      },
    });
    await gsap.to(obj, {
      duration,
      length: this.ROD_LENGTH,
      ease: Sine.easeInOut,
      onUpdate: () => {
        //
        this.changeLength(obj.length);
      },
    });

    this.doneCatch();
  }

  async doneCatch() {
    this.isStopRotate = false;
    this.hook.isActive = false;
    this.hook.releaseComplete();
  }

  resize(e: any) {
    const { width, height } = e;

    if (!this.player) return;

    scaleByHeight(this.player, height * 0.26);
    this.player.y = height * 0.1;
    this.player.x = width - width * 0.94;

    // Rod
    this.holderRod.position.x = this.player.x + this.player.width * 0.95;
    this.holderRod.position.y = this.player.y;

    //Hook
    // this.hook.position.x = this.player.x + this.player.width * 0.93;
    // this.hook.position.y = this.player.y + this.wire.height;

    this.changeLength(this.ROD_LENGTH);
  }

  changeLength(length: number) {
    //
    this.wire.scale.y = length;
    this.hook.position.set(-3.9259336755865775, length + 12);
  }

  update(_e: any) {
    //

    if (!this.holderRod || this.isStopRotate) {
      return;
    }
    this.time += _e;
    this.rad = Math.sin(this.time * 0.02) * 0.7;

    this.holderRod.rotation = this.rad;
  }
}
