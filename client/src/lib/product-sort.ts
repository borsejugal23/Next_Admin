export const PRODUCT_SORT_PARAM_KEY = "sort";

export const PRODUCT_SORT_FIELDS = [
  { label: "Price", value: "price" },
  { label: "Stock", value: "stock" },
  { label: "Rating", value: "rating" },
] as const;

export const PRODUCT_SORT_DIRECTIONS = [
  { label: "Low → High", value: "asc" },
  { label: "High → Low", value: "desc" },
] as const;

export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number]["value"];
export type ProductSortDirection =
  (typeof PRODUCT_SORT_DIRECTIONS)[number]["value"];

export type ProductSortValue =
  | ""
  | `${ProductSortField}-${ProductSortDirection}`;

const ALLOWED_SORT_VALUES = new Set<string>([
  "",
  ...PRODUCT_SORT_FIELDS.flatMap((field) =>
    PRODUCT_SORT_DIRECTIONS.map(
      (direction) => `${field.value}-${direction.value}`,
    ),
  ),
]);

export function buildProductSortValue(
  field: ProductSortField,
  direction: ProductSortDirection,
): ProductSortValue {
  return `${field}-${direction}`;
}

export function getProductSortLabel(sort: ProductSortValue): string {
  if (!sort) return "Default";

  const [field, direction] = sort.split("-") as [
    ProductSortField,
    ProductSortDirection,
  ];
  const fieldLabel =
    PRODUCT_SORT_FIELDS.find((item) => item.value === field)?.label ?? field;
  const directionLabel =
    PRODUCT_SORT_DIRECTIONS.find((item) => item.value === direction)?.label ??
    direction;

  return `${fieldLabel} · ${directionLabel}`;
}

export function getProductSortFromParams(
  searchParams: URLSearchParams,
): ProductSortValue {
  const raw = (searchParams.get(PRODUCT_SORT_PARAM_KEY) ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "";

  return ALLOWED_SORT_VALUES.has(raw) ? (raw as ProductSortValue) : "";
}

export function applyProductSortToParams(
  params: URLSearchParams,
  sort: ProductSortValue,
) {
  if (sort) {
    params.set(PRODUCT_SORT_PARAM_KEY, sort);
  } else {
    params.delete(PRODUCT_SORT_PARAM_KEY);
  }

  params.delete("page");
}

export function parseProductSortValue(sort: ProductSortValue) {
  if (!sort) {
    return { field: null as ProductSortField | null, direction: null as ProductSortDirection | null };
  }

  const [field, direction] = sort.split("-") as [
    ProductSortField,
    ProductSortDirection,
  ];

  return { field, direction };
}
