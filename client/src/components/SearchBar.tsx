"use client";

import { useEffect, useState } from "react";

type SearchBarProps = {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
};

export default function SearchBar({
  value,
  onSearch,
  placeholder = "Search by name",
  className = "w-1/3",
  debounceMs = 700,
}: SearchBarProps) {
  // Local state for instant typing
  const [inputValue, setInputValue] = useState(value);

  // Keep input in sync if parent changes the value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, debounceMs);

    // Cancel previous timer whenever input changes
    return () => clearTimeout(timer);
  }, [inputValue, debounceMs, onSearch]);

  // const handleClear = () => {
  //   setInputValue("");
  //   onSearch("");
  // };

  return (
    <div className={`relative ${className}`}>
      <input
        id="search-bar-input"
        name="search"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`w-full rounded-md border border-gray-300 bg-white py-2 pl-3 text-sm outline-none ${
          inputValue ? "pr-3" : "pr-3"
        }`}
      />

      {/* {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 cursor-pointer"
        >
          <X size={10} strokeWidth={3} />
        </button>
      )} */}
    </div>
  );
}
