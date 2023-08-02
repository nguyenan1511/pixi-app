import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="info fixed top-[40px] left-[20px] z-[10] flex gap-[10px]">
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px] gap-[10px]"
        href="https://github.com/nguyenan1511/pixi-app"
        target="_blank"
      >
        <img src={"/assets/images/github.png"} alt="" className="w-[40px]" />
        <span>An Nguyen</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px]"
        href="/"
      >
        <span>Box</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px]"
        href="/sample"
      >
        <span>Card</span>
      </Link>
      <Link
        className="bg-white px-[10px] py-[6px] flex items-center rounded-[20px]"
        href="/background"
      >
        <span>Background Top</span>
      </Link>
    </div>
  );
};

export default Header;
