import React, { useState, useRef, useEffect } from "react";

const SearchBarWithDropdown = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
      setShowDropdown(true);
    } else {
      setFilteredResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectResult = (item) => {
    setSearchTerm(item);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-80" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() =>
          searchTerm.length > 0 &&
          filteredResults.length > 0 &&
          setShowDropdown(true)
        }
      />
      {showDropdown && filteredResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filteredResults.map((item, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectResult(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarWithDropdown;
