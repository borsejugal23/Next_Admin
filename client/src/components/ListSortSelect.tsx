"use client";

import {
  buildProductSortValue,
  getProductSortLabel,
  parseProductSortValue,
  PRODUCT_SORT_DIRECTIONS,
  PRODUCT_SORT_FIELDS,
  type ProductSortDirection,
  type ProductSortField,
  type ProductSortValue,
} from "@/lib/product-sort";
import { ArrowUpDown, ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ListSortSelectProps = {
  value: ProductSortValue;
  onChange: (value: ProductSortValue) => void;
  align?: "left" | "right";
  className?: string;
};

const ListSortSelect = ({
  value,
  onChange,
  align = "left",
  className = "",
}: ListSortSelectProps) => {
  const [open, setOpen] = useState(false);
  const [expandedField, setExpandedField] = useState<ProductSortField | null>(
    null,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const activeSort = parseProductSortValue(value);
  const selectionLabel = getProductSortLabel(value);

  useEffect(() => {
    if (!open) setExpandedField(null);
  }, [open]);

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

  const handleDirectionSelect = (
    field: ProductSortField,
    direction: ProductSortDirection,
  ) => {
    onChange(buildProductSortValue(field, direction));
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative w-56 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Sort products"
        className={`flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md border bg-white px-2.5 py-1.5 text-sm font-medium transition focus:outline-none ${
          open || value
            ? "border-blue-500 ring-2 ring-blue-500/20"
            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ArrowUpDown className="h-4 w-4 shrink-0 text-gray-500" />
          <span className="truncate text-gray-900">Sort</span>
          {value ? (
            <span className="truncate text-xs font-normal text-gray-500">
              · {selectionLabel}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Sort options"
          className={`absolute top-full z-50 mt-1 w-full rounded-md border border-gray-300 bg-white p-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={`w-full rounded px-2 py-1.5 text-left text-sm transition ${
              !value
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Default
          </button>

          {PRODUCT_SORT_FIELDS.map((field) => {
            const isExpanded = expandedField === field.value;
            const isFieldActive = activeSort.field === field.value;

            return (
              <div key={field.value} className="py-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedField((current) =>
                      current === field.value ? null : field.value,
                    )
                  }
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm transition ${
                    isFieldActive
                      ? "bg-blue-50/70 font-medium text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{field.label}</span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded ? (
                  <div className="mt-1 flex gap-1.5 px-2 pb-1">
                    {PRODUCT_SORT_DIRECTIONS.map((direction) => {
                      const sortValue = buildProductSortValue(
                        field.value,
                        direction.value,
                      );
                      const isSelected = value === sortValue;

                      return (
                        <button
                          key={direction.value}
                          type="button"
                          onClick={() =>
                            handleDirectionSelect(field.value, direction.value)
                          }
                          className={`flex-1 rounded-md border px-2 py-1.5 text-center text-xs font-medium transition ${
                            isSelected
                              ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                              : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {direction.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ListSortSelect;
