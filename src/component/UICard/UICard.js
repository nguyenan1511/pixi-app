import { Application } from "pixi.js";
import { useEffect, useRef, useState } from "react";

import CardScene from "../../modules/scenes/CardScene";
import { useEffectOnce } from "../../plugins/hooks/useEffectOnce";

const PageCard = () => {
  const ref = useRef(null);

  const [widthState, setWidthState] = useState(0);
  const [heightState, setHeightState] = useState(90);

  const init = async () => {
    if (!ref?.current) return;

    const app = new Application({
      width: 500,
      height: 500,
      background: "#dddddd",
    });
    window.uData = {
      app,
    };

    ref.current.appendChild(app.view);

    const { stage, renderer } = app;
    const ev = { resize: "resizeCanvas" };

    const onResize = (e) => {
      const { width, height } = e;

      renderer.resize(width, height);
      app.render();
    };
    stage.on(ev.resize, onResize);

    const cardScene = new CardScene();
    stage.addChild(cardScene);
    app.render();
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

  useEffectOnce(() => {
    init();
  }, []);

  return (
    <div className="wrap flex flex-col gap-[40px]">
      <div
        ref={ref}
        className="holder h-[353px] w-[340px] resize overflow-auto bg-black"
      ></div>
    </div>
  );
};

export default PageCard;
