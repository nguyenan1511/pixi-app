import dynamic from "next/dynamic";
import React from "react";
import ListenerProvider from "../component/context/ListenerProvider";

const UIBackground = dynamic(() => import("../component/UIBackground"), {
  ssr: false,
});

const background = () => {
  return (
    <ListenerProvider>
      <UIBackground />
      {/* game */}
    </ListenerProvider>
  );
};

export default background;
