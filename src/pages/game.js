import dynamic from "next/dynamic";
import React from "react";
import MasterPage from "../component/MasterPage";
import Link from "next/link";

const UIGame = dynamic(() => import("../component/UIGame"), { ssr: false });

const game = () => {
  return (
    <>
      <div className="info fixed top-[40px] left-[20px] z-[10] flex gap-[10px]">
        <Link
          className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px]"
          href="/"
        >
          <span>Home</span>
        </Link>
      </div>
      <UIGame />
      {/* game */}
    </>
  );
};

export default game;
