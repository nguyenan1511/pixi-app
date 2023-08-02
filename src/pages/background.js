import dynamic from "next/dynamic";
import React from "react";
import MasterPage from "../component/MasterPage";

const UIBackground = dynamic(() => import("../component/UIBackground"), {
  ssr: false,
});

const background = () => {
  return (
    <MasterPage>
      <UIBackground />
      {/* game */}
    </MasterPage>
  );
};

export default background;
