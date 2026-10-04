"use client";

import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type FilterMenuProps<TFilter extends string> = {
  filterFor: TFilter;
  openFilter: boolean;
  filterOptions: readonly string[];
  selectedFilters: string[];
  onToggle: () => void;
  onSelect: (value: string, checked: boolean) => void;
  onClose: () => void;
};

const DROPDOWN_ITEM_HEIGHT_PX = 36;
const DROPDOWN_MAX_VISIBLE_ITEMS = 9;

function getDropdownMaxHeight(optionCount: number) {
  if (optionCount === 0) return undefined;

  const visibleItems = Math.min(optionCount, DROPDOWN_MAX_VISIBLE_ITEMS);
  return visibleItems * DROPDOWN_ITEM_HEIGHT_PX;
}

const FilterMenu = <TFilter extends string>({
  filterFor,
  openFilter,
  filterOptions,
  selectedFilters,
  onToggle,
  onSelect,
  onClose,
}: FilterMenuProps<TFilter>) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownMaxHeight = getDropdownMaxHeight(filterOptions.length);

  useEffect(() => {
    if (!openFilter) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openFilter, onClose]);

  return (
    <div ref={rootRef} className="relative w-30">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={openFilter}
        className={`flex w-full cursor-pointer select-none items-center justify-between rounded-md border bg-white px-2 py-1.5 text-sm font-medium transition focus:outline-none ${
          openFilter
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span>{filterFor}</span>

        <ChevronDownIcon
          className={`h-4 w-4 cursor-pointer transition-transform duration-200 ${
            openFilter ? "rotate-180" : ""
          }`}
        />
      </button>

      {openFilter ? (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-60 overflow-y-auto overscroll-contain rounded-md border border-gray-300 bg-white p-1 shadow-lg"
          style={
            dropdownMaxHeight ? { maxHeight: dropdownMaxHeight } : undefined
          }
        >
          {filterOptions.map((option) => (
            <label
              key={option}
              className="flex min-h-8 cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-gray-600 transition hover:bg-gray-200"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedFilters.includes(option)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onChange={(event) => {
                  onSelect(event.target.value, event.target.checked);
                }}
              />

              <span className="truncate">{option}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default FilterMenu;
