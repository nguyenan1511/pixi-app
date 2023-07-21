/* eslint-disable class-methods-use-this */
import scaleByHeight from "diginext-pixi/dist/helper/scaleByHeight";

import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

export const vertexSrc = `
precision mediump float;

attribute vec2 aVertexPosition;
attribute vec2 aUvs;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

varying vec2 vUvs;

void main() {

    vUvs = aUvs;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

}`;

export const fragmentSrc = `

precision mediump float;

varying vec2 vUvs;

uniform sampler2D uSampler2;
uniform float time;

void main() {

    gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 2.) ) * 0.008 );
}`;

export const vertexPositions = [
  -460, -720, 0, -153.333343505859, -720, 0, 153.333312988281, -720, 0,
  459.999969482422, -720, 0, -460, -240, 0, -153.333343505859, -240, 0,
  153.333312988281, -240, 0, 459.999969482422, -240, 0, -460, 240, 0,
  -153.333343505859, 240, 0, 153.333312988281, 240, 0, 459.999969482422, 240, 0,
  -460, 720, 0, -153.333343505859, 720, 0, 153.333312988281, 720, 0,
  459.999969482422, 720, 0,
];
export const uvs = [
  0, 0, 0.333333343267441, 0, 0.666666686534882, 0, 1, 0, 0, 0.333333343267441,
  0.333333343267441, 0.333333343267441, 0.666666686534882, 0.333333343267441, 1,
  0.333333343267441, 0, 0.666666686534882, 0.333333343267441, 0.666666686534882,
  0.666666686534882, 0.666666686534882, 1, 0.666666686534882, 0, 1,
  0.333333343267441, 1, 0.666666686534882, 1, 1, 1,
];
export const uvIndexs = [
  5, 4, 0, 5, 0, 1, 6, 5, 1, 6, 1, 2, 7, 6, 2, 7, 2, 3, 9, 8, 4, 9, 4, 5, 10, 9,
  5, 10, 5, 6, 11, 10, 6, 11, 6, 7, 13, 12, 8, 13, 8, 9, 14, 13, 9, 14, 9, 10,
  15, 14, 10, 15, 10, 11,
];

export const geometry = new PIXI.Geometry()
  .addAttribute(
    "aVertexPosition", // the attribute name
    vertexPositions, // x, y
    3
  ) // the size of the attribute
  .addAttribute(
    "aUvs", // the attribute name
    uvs, // u, v
    2
  ) // the size of the attribute
  .addIndex(uvIndexs);

export default class BgOcean extends Container {
  constructor(props?: any) {
    super();
    this.props = { ...this.props, props };
  }

  bg: PIXI.Sprite | any;

  props: any;

  async awake() {
    console.log("awake BgOcean");
  }

  async createMesh(url: string) {
    const app = (window as any).uData?.app as any;
    if (!app) return;

    const stage = app.stage as PIXI.Container;
    if (!stage) return;
    const { renderer } = app;

    /* <-------  bg  -------> */

    const uSampler2 = await PIXI.Texture.fromURL(url);

    const mesh = new PIXI.Mesh(
      geometry,
      PIXI.Shader.from(vertexSrc, fragmentSrc, {
        uSampler2,
        time: 0,
      })
    );

    mesh.pivot.y = 720;
    mesh.scale.y *= 0.63888888888889;
    mesh.scale.x *= 2;
    if (!mesh) return;
    this.bg = mesh;

    const ev = { resize: "resizeCanvas" } as any;
    stage.on(ev.resize, this.resize.bind(this));
    this.resize({ width: renderer.width, height: renderer.height });
    return mesh;

    //
  }

  /* <-------  resize  -------> */
  resize(e: any) {
    const { width, height } = e;
    const deltaY = -height * 0.32;

    this.bg.x = width / 2;
    this.bg.y = height;
    scaleByHeight(this.bg, height + deltaY);
  }
}
