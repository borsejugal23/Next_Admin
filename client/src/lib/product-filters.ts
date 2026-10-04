import type { ProductListFilterType } from "@/types/filter";

export const PRODUCT_FILTER_OPTIONS = {
  Category: [] as readonly string[],
  Stock: ["In Stock", "Out of Stock"],
} as const;

export const PRODUCT_FILTER_PARAM_KEYS: Record<ProductListFilterType, string> = {
  Category: "category",
  Stock: "stock",
};

export function parseProductFilterParam(
  searchParams: URLSearchParams,
  filter: ProductListFilterType,
): string[] {
  const paramKey = PRODUCT_FILTER_PARAM_KEYS[filter];
  const raw = searchParams.get(paramKey);
  if (!raw) return [];

  return [
    ...new Set(raw.split(",").map((value) => value.trim()).filter(Boolean)),
  ];
}

function parseValidatedFilterParam(
  searchParams: URLSearchParams,
  filter: ProductListFilterType,
  allowedOptions: readonly string[],
) {
  const selected = parseProductFilterParam(searchParams, filter);
  if (allowedOptions.length === 0) return selected;

  const allowed = new Set(allowedOptions);
  return selected.filter((value) => allowed.has(value));
}

export function getSelectedProductFilters(
  searchParams: URLSearchParams,
  categoryOptions: readonly string[] = [],
) {
  return {
    Category: parseValidatedFilterParam(
      searchParams,
      "Category",
      categoryOptions,
    ),
    Stock: parseValidatedFilterParam(
      searchParams,
      "Stock",
      PRODUCT_FILTER_OPTIONS.Stock,
    ),
  };
}

export type SelectedProductFilters = ReturnType<
  typeof getSelectedProductFilters
>;

export function getProductListFilterQueryKey(
  selectedFilters: SelectedProductFilters,
) {
  return {
    categories: selectedFilters.Category.slice().sort().join(","),
    stock: selectedFilters.Stock.slice().sort().join(","),
  };
}

/** Normalized values for GET /products query params (backend-ready). */
export function toProductListApiFilters(selectedFilters: SelectedProductFilters) {
  return {
    categories: selectedFilters.Category,
    stock: selectedFilters.Stock,
  };
}

export type ProductFilterMenuProps<TFilter extends ProductListFilterType> = {
  filterFor: TFilter;
  openFilter: boolean;
  selectedFilters: SelectedProductFilters[TFilter];
  onToggle: () => void;
  onSelect: (value: string, checked: boolean) => void;
  onClose: () => void;
};
