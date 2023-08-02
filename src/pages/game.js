import dynamic from "next/dynamic";
import React from "react";
import MasterPage from "../component/MasterPage";

const UIGame = dynamic(() => import("../component/UIGame"), { ssr: false });

const game = () => {
  return (
    <MasterPage>
      <UIGame />
      {/* game */}
    </MasterPage>
  );
};

export default game;
