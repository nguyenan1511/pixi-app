import { useEffect, useRef } from "react";
import React from "react";

const Test = () => {
  const zaloBtnRef = useRef();
  // Reload Button Zalo
  useEffect(() => {
    if (typeof window == "undefined") return;
    if (window.ZaloSocialSDK && zaloBtnRef.current) {
      window.ZaloSocialSDK.reload();
    }
  }, [zaloBtnRef.current]);

  return (
    <div>
      Test
      {/* <div
        ref={zaloBtnRef}
        className="zalo-chat-widget"
        data-oaid="579745863508352884"
        data-welcome-message="Rất dui được gặp bạn"
        data-autopopup={4}
      ></div> */}
    </div>
  );
};

export default Test;
