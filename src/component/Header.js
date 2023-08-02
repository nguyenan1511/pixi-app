import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="info fixed top-[20px] left-[10px] z-[10] flex gap-[10px] xs:gap-[6px]">
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] gap-[10px] xs:px-[6px] xs:py-[2px] xs:rounded-[6px]"
        href="https://github.com/nguyenan1511/pixi-app"
        target="_blank"
      >
        <img
          src={"/assets/images/github.png"}
          alt=""
          className="w-[40px] xs:w-[30px]"
        />
        <span className="xs:text-[10px]">An Nguyen</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] xs:px-[6px] xs:py-[2px] xs:rounded-[6px]"
        href="/"
      >
        <span className="xs:text-[10px]">Box</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] xs:px-[6px] xs:py-[2px] xs:rounded-[6px]"
        href="/sample"
      >
        <span className="xs:text-[10px]">Card</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] xs:px-[6px] xs:py-[2px] xs:rounded-[6px]"
        href="/background"
      >
        <span className="xs:text-[10px]">Background Top</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] xs:px-[6px] xs:py-[2px] xs:rounded-[6px]"
        href="/game"
      >
        <span className="xs:text-[10px]">Game</span>
      </Link>
    </div>
  );
};

export default Header;
