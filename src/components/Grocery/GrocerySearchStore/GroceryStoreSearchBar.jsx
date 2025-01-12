"use client";

import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const GroceryStoreSearchBar = () => {
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchText.trim().length > 1) {
      router.push(`/grocery/all/search-store?query=${searchText}`);
    }
  };

  const clearSearchText = () => {
    setSearchText("");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <input
          type="text"
          className="w-full py-3 px-5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search store"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        {searchText.trim().length > 0 && (
          <button
            type="button"
            onClick={clearSearchText}
            className="absolute top-1/2 transform -translate-y-1/2 right-14 bg-gray-100 text-gray-500 p-1.5 rounded-xl hover:bg-gray-200 focus:outline-none"
          >
            <RxCross2 className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default GroceryStoreSearchBar;

// "use client";

// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const GroceryStoreSearchBar = () => {
//   const [searchText, setSearchText] = useState("");

//   const router = useRouter();

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchText.trim().length > 1) {
//       router.push(`/grocery/all/search-store?query=${searchText}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <form onSubmit={handleSearchSubmit} className="relative w-full">
//         <input
//           type="text"
//           className="w-full py-3 px-5 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Search store"
//           value={searchText}
//           onChange={(e) => {
//             setSearchText(e.target.value);
//           }}
//         />
//         <button
//           type="submit"
//           className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="w-5 h-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//             />
//           </svg>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default GroceryStoreSearchBar;
