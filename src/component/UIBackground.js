/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-use-before-define */
import AppThree from "diginext-three/dist/components/AppThree";
import AppEvent from "diginext-three/dist/data/AppEvent";
import React, { useEffect, useState } from "react";

import { useListener } from "./context/ListenerProvider";
import TestThreeScene from "../modules/bg/scenes/TestThreeScene";

const UIBackground = (props) => {
  const [main, setMain] = useState(<></>);

  const listener = useListener();

  const onListen = (e) => {
    const { type } = e;
    switch (type) {
      case AppEvent.LOADED_APP_THREE:
        {
          init();
        }
        break;

      default:
        break;
    }
  };

  if (listener) {
    listener.useSubscription((e) => {
      onListen(e);
    });
  }

  const init = async () => {
    //

    const { uData } = window;
    if (!uData) return;

    const { scene } = uData;
    if (!scene) return;

    const root = new TestThreeScene();
    scene.add(root);
  };

  useEffect(() => {
    // effect
    setMain(<AppThree showGrid={false} is3D={false} listener={listener} />);

    return () => {
      // cleanup
    };
  }, []);

  return (
    <>
      <div className="holder fixed left-0 top-0 z-0 h-full w-full bg-[#171520]">
        {main}
      </div>
      {props.children}
    </>
  );
};

export default UIBackground;
