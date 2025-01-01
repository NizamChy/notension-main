import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <DotLottieReact
        src="https://lottie.host/83ecd8f7-1aed-426d-895b-d2fcbdb013f1/CEgON642qn.lottie"
        loop
        autoplay
        className="size-36"
      />
    </div>
  );
};

export default Loader;

// import React from "react";

// const Loader = () => {
//   return (
//     <div className="flex justify-center items-center min-h-[30vh]">
//       <div
//         className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
//         role="status"
//       >
//         <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
//           Loading...
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Loader;

// src="https://lottie.host/3bd94bda-7d75-45bc-9a69-79a650633702/QhJsBs2V7F.lottie"
// src="https://lottie.host/6f5eec64-e98e-4855-9d1e-2b30d74459de/iFUyWtMItI.lottie"
// src="https://lottie.host/a9ac8f3f-e7ee-4fe9-ab44-d81ab500a2f2/vJ1PjTzZqM.lottie"
