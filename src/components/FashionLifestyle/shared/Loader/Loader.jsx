import React from "react";

const Loader = () => {
  const items = Array.from({ length: 9 });

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="grid grid-cols-3 grid-rows-3 w-[67.2px] h-[67.2px]">
        {items.map((_, index) => (
          <div
            key={index}
            className="bg-blue-600"
            style={{
              animation: `flipping-18i5bq 1.5s ${
                index * 0.1
              }s infinite backwards`,
            }}
          />
        ))}
        <style>
          {`
          @keyframes flipping-18i5bq {
            0% {
              transform: perspective(67.2px) rotateX(-90deg);
            }
            50%, 75% {
              transform: perspective(67.2px) rotateX(0);
            }
            100% {
              opacity: 0;
              transform: perspective(67.2px) rotateX(0);
            }
          }
        `}
        </style>
      </div>
    </div>
  );
};

export default Loader;
