"use client";

import useCan from "@/authorization/useCan";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

function formatCategoryLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type CategorySelectProps = {
  id?: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function CustomSelect({
  id,
  value = "",
  options,
  onChange,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const hasValue = Boolean(value);
  const canEdit = useCan("product:update");

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleOpenOptions = () => {
    if (!canEdit) return;
    setOpen((current) => !current);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={handleOpenOptions}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition focus:outline-none focus:border-[1.5px] focus:border-[#fb794a]/60 ${
          hasValue
            ? "border-[#fb794a]/45 bg-[#fff4ef] font-medium text-[#c45a2d]"
            : "border-[#eae3de] bg-white text-[#6e5f5d]"
        }`}
      >
        <span className="truncate">
          {hasValue ? formatCategoryLabel(value) : "Select category"}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition ${open ? "rotate-180" : ""} ${
            hasValue ? "text-[#c45a2d]" : "text-[#6e5f5d]"
          }`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Category"
          className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-40 overflow-y-auto overscroll-contain rounded-xl border border-[#eae3de] bg-white py-1 shadow-lg"
        >
          {options.map((option, index) => {
            const selected = option === value;
            const zebra = index % 2 === 0 ? "bg-white" : "bg-[#f7f0eb]";

            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${zebra} ${
                    selected
                      ? "bg-[#fff4ef] font-semibold text-[#c45a2d]"
                      : "text-[#1a0e0e] hover:bg-[#fbe8de]"
                  }`}
                >
                  <span className="truncate">
                    {formatCategoryLabel(option)}
                  </span>
                  {selected ? <Check size={14} className="shrink-0" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
