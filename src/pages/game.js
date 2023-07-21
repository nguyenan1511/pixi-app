import dynamic from "next/dynamic";
import React from "react";

const UIGame = dynamic(() => import("../component/UIGame"), { ssr: false });

const game = () => {
  return (
    <>
      <UIGame />
      {/* game */}
    </>
  );
};

export default game;
