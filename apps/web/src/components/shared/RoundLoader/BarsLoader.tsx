import React, { type CSSProperties } from "react";

// Inline styles plus the CSS custom properties the keyframes read.
type BarStyle = CSSProperties & Record<`--${string}`, number>;

const RoundLoader = () => {
  const spinnerDivs = Array.from({ length: 10 }).map((_, index) => {
    const delay = (index + 1) * 0.1;
    const rotation = (index + 1) * 36;
    const translation = 150;
    const style: BarStyle = {
      "--delay": delay,
      "--rotation": rotation,
      "--translation": translation,
      transform: `rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%))`,
      animation: `spinner-animation 1s calc(var(--delay) * 1s) infinite ease`,
    };

    return (
      <div
        key={index}
        className="absolute w-[50%] h-[140%] bg-primary dark:bg-[#7FB2FF]"
        style={style}
      ></div>
    );
  });

  return (
    <div className="absolute w-[9px] h-[9px]">
      {spinnerDivs}
      <style>
        {` @keyframes spinner-animation {
                0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
                transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
               }
               50% {
                transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
               }
              }
            `}
      </style>
    </div>
  );
};

export default RoundLoader;
