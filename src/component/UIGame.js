import * as PIXI from "pixi.js";

import { useEffect, useRef, useState } from "react";
import GameScenes from "../modules/scenes/GameScenes";

const UIGame = () => {
  const ref = useRef(null);

  const [widthState, setWidthState] = useState(0);
  const [heightState, setHeightState] = useState(90);

  const init = async () => {
    if (!ref?.current) return;

    const app = new PIXI.Application({
      width: 375,
      height: 667,
      background: "#dddddd",
      autoStart: true,
    });
    window.uData = {
      app,
    };

    ref.current.appendChild(app.view);

    const { stage, renderer } = app;
    const ev = { resize: "resizeCanvas" };

    const cardScene = new GameScenes();
    await cardScene.awake();
    stage.addChild(cardScene);
    app.render();

    const onResize = (e) => {
      const { width, height } = e;
      renderer.resize(width, height);
      app.render();
    };
    stage.on(ev.resize, onResize);
  };

  const doCatch = () => {
    const uData = window.uData;
    if (!uData) return;

    window.uData?.app?.stage?.emit("do_catch", {
      title: "Do catch nao!!!",
    });
  };

  useEffect(() => {
    window.uData?.app?.stage?.emit("resizeCanvas", {
      width: widthState,
      height: heightState,
    });
  }, [widthState, heightState]);

  useEffect(() => {
    if (!ref?.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      const widthCeil = Math.ceil(width);

      const heightCeil = Math.ceil(height);

      setWidthState(widthCeil);
      setHeightState(heightCeil);
    });
    resizeObserver.observe(ref?.current);
  }, [ref?.current]);

  useEffect(() => {
    init();

    if (typeof window === "undefined") return;
    document.addEventListener("click", doCatch);
  }, []);

  return (
    <>
      <div className="wrap flex flex-col gap-[40px]">
        <div
          ref={ref}
          className="holder h-[667px] w-[375px] resize overflow-auto bg-black"
        ></div>
      </div>
    </>
  );
};

export default UIGame;
