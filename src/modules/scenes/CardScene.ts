/* eslint-disable class-methods-use-this */
import gsap, { Back, Sine } from "gsap";
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

import Card from "../particles/Card";
import HolderDot from "../particles/HolderDot";
import HolderFlareLine from "../particles/HolderFlareLine";
import moveToBottom from "../../plugins/helper/moveToBottom";
import scaleFull from "../../plugins/helper/scaleFull";

export default class CardScene extends Container {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };

    this.awake();
  }

  props: any;

  bg: PIXI.Sprite | any;

  holder: Container | any;

  holderDot: any;

  holderFlareLine: any;

  card: any;

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
      "/assets/images-webp/bg-card.webp"
    );
    if (!texture) return;
    this.bg = PIXI.Sprite.from(texture);
    this.bg.anchor.set(0.5);
    this.bg.alpha = 0;

    this.addChild(this.bg);
    moveToBottom(this.bg);

    /* <-------  FlareLine  -------> */
    this.holderFlareLine = new HolderFlareLine();
    await this.holderFlareLine.awake();
    this.holderFlareLine.scale.set(0);
    this.holder.addChild(this.holderFlareLine);

    /* <-------  dots  -------> */
    this.holderDot = new HolderDot();
    await this.holderDot.awake();
    this.holderDot.scale.set(0);
    this.holder.addChild(this.holderDot);
    /* <-------  Card  -------> */
    this.card = new Card();
    await this.card.awake();
    this.card.rotation = 1.2;
    this.card.scale.set(0);
    this.holder.addChild(this.card);

    //

    app.ticker.add((time: number) => {
      // deltaTime
      this.holderDot.animate(time);
      this.holderFlareLine.animate(time);
    });

    const ev = { resize: "resizeCanvas" } as any;

    stage.on(ev.resize, this.resize.bind(this));

    this.resize({ width: renderer.width, height: renderer.height });

    this.animateIn();
  }

  async animateIn() {
    //
    console.log("animateIn");

    await gsap.to(this.bg, { duration: 0.7, alpha: 1, ease: Sine.easeInOut });
    gsap.to(this.card.scale, { duration: 0.7, x: 1, y: 1, ease: Back.easeOut });
    await gsap.to(this.card, {
      duration: 0.7,
      rotation: 0,
      ease: Back.easeOut,
    });

    gsap.to(this.holderDot.scale, {
      duration: 0.7,
      x: 1,
      y: 1,
      ease: Sine.easeInOut,
    });
    gsap.to(this.holderFlareLine.scale, {
      duration: 0.7,
      x: 1,
      y: 1,
      ease: Sine.easeInOut,
    });

    // this.card.scale.set(0);
    // this.card.rotation = rand(2);
  }
  //

  animateOut() {
    //
    console.log("animateOut");
  }
  //

  /* <-------  resize  -------> */
  resize(e: any) {
    const { width, height } = e;

    this.bg.x = width / 2;
    this.bg.y = height / 2;

    this.holder.x = width / 2;

    this.holder.y = height / 2;

    scaleFull(this.bg, width, height);
  }
}
