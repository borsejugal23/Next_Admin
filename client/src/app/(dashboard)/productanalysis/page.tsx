"use client";

import { getProducts } from "@/services/productApi";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Layers3,
  LoaderCircle,
  Package,
  PackageCheck,
  PackageX,
  Star,
  Warehouse,
} from "lucide-react";

const PAGE_SIZE = 200;
const LOW_STOCK_LIMIT = 10;
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("en-IN");

type CategorySummary = {
  name: string;
  products: number;
  averagePrice: number;
  stock: number;
  averageRating: number;
};

async function getCatalog() {
  const firstPage = await getProducts({ page: 1, limit: PAGE_SIZE });
  const pageCount = Math.ceil((firstPage.total ?? 0) / PAGE_SIZE);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      getProducts({ page: index + 2, limit: PAGE_SIZE }),
    ),
  );

  return [firstPage, ...remainingPages].flatMap(
    (response) => response.products ?? [],
  );
}

function summarizeProducts(products: Product[]) {
  const categories = new Map<string, Product[]>();

  for (const product of products) {
    const category = product.category?.trim() || "Uncategorized";
    categories.set(category, [...(categories.get(category) ?? []), product]);
  }

  const average = (values: number[]) =>
    values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;

  const categorySummaries: CategorySummary[] = Array.from(
    categories,
    ([name, items]) => ({
      name,
      products: items.length,
      averagePrice: average(
        items.flatMap((item) =>
          Number.isFinite(item.price) ? [item.price as number] : [],
        ),
      ),
      stock: items.reduce((sum, item) => sum + Math.max(0, item.stock ?? 0), 0),
      averageRating: average(
        items.flatMap((item) =>
          Number.isFinite(item.rating) ? [item.rating as number] : [],
        ),
      ),
    }),
  ).sort((first, second) => second.products - first.products);

  const pricedProducts = products.flatMap((product) =>
    Number.isFinite(product.price) ? [product.price as number] : [],
  );
  const ratedProducts = products.flatMap((product) =>
    Number.isFinite(product.rating) ? [product.rating as number] : [],
  );

  return {
    categorySummaries,
    totalStock: products.reduce(
      (sum, product) => sum + Math.max(0, product.stock ?? 0),
      0,
    ),
    averagePrice: average(pricedProducts),
    averageRating: average(ratedProducts),
    inStock: products.filter((product) => (product.stock ?? 0) > 0),
    healthyStock: products.filter(
      (product) => (product.stock ?? 0) > LOW_STOCK_LIMIT,
    ),
    outOfStock: products.filter((product) => (product.stock ?? 0) <= 0),
    lowStock: products.filter(
      (product) =>
        (product.stock ?? 0) > 0 && (product.stock ?? 0) <= LOW_STOCK_LIMIT,
    ),
  };
}

const metricStyles = [
  { icon: Package, iconClass: "bg-blue-50 text-blue-700", accent: "#2563eb" },
  {
    icon: PackageCheck,
    iconClass: "bg-emerald-50 text-emerald-700",
    accent: "#059669",
  },
  {
    icon: Layers3,
    iconClass: "bg-violet-50 text-violet-700",
    accent: "#7c3aed",
  },
  {
    icon: Warehouse,
    iconClass: "bg-emerald-50 text-emerald-700",
    accent: "#059669",
  },
  {
    icon: CircleDollarSign,
    iconClass: "bg-amber-50 text-amber-700",
    accent: "#d97706",
  },
  { icon: Star, iconClass: "bg-orange-50 text-orange-700", accent: "#ea580c" },
  { icon: PackageX, iconClass: "bg-rose-50 text-rose-700", accent: "#e11d48" },
  {
    icon: AlertTriangle,
    iconClass: "bg-cyan-50 text-cyan-700",
    accent: "#0891b2",
  },
];

export default function ProductAnalysisPage() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "analysis"],
    queryFn: getCatalog,
  });

  const summary = summarizeProducts(products);
  const metrics = [
    {
      label: "Total Products",
      value: number.format(products.length),
      detail: "In your catalog",
    },
    {
      label: "In Stock",
      value: number.format(summary.inStock.length),
      detail: "Products with available units",
    },
    {
      label: "Total Categories",
      value: number.format(summary.categorySummaries.length),
      detail: "Active product groups",
    },
    {
      label: "Total Stock",
      value: number.format(summary.totalStock),
      detail: "Units on hand",
    },
    {
      label: "Average Product Price",
      value: currency.format(summary.averagePrice),
      detail: "Across listed prices",
    },
    {
      label: "Average Rating",
      value: summary.averageRating.toFixed(1),
      detail: "Out of 5.0",
    },
    {
      label: "Out-of-Stock Products",
      value: number.format(summary.outOfStock.length),
      detail: "Need replenishment",
    },
    {
      label: "Low-Stock Products",
      value: number.format(summary.lowStock.length),
      detail: `At or below ${LOW_STOCK_LIMIT} units`,
    },
  ];
  const stockHealthTotal = products.length;
  const healthyPercent = stockHealthTotal
    ? (summary.healthyStock.length / stockHealthTotal) * 100
    : 0;
  const lowStockPercent = stockHealthTotal
    ? (summary.lowStock.length / stockHealthTotal) * 100
    : 0;
  const healthyEnd = healthyPercent;
  const lowStockEnd = healthyPercent + lowStockPercent;
  const stockHealthBackground = stockHealthTotal
    ? `conic-gradient(#16a34a 0% ${healthyEnd}%, #f59e0b ${healthyEnd}% ${lowStockEnd}%, #e11d48 ${lowStockEnd}% 100%)`
    : "#e2e8f0";
  const mostPopulatedCategories = summary.categorySummaries.slice(0, 6);
  const largestCategoryCount = Math.max(
    1,
    ...mostPopulatedCategories.map((category) => category.products),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f7f6]">
        <LoaderCircle className="animate-spin text-emerald-700" size={34} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-4 flex min-h-64 flex-col items-center justify-center gap-2 border border-rose-200 bg-rose-50 p-8 text-center">
        <PackageX className="text-rose-700" size={28} />
        <p className="font-semibold text-slate-900">
          Product analysis is unavailable
        </p>
        <p className="text-sm text-slate-600">
          We couldn&apos;t load the catalog. Refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[#f5f7f6] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
              Inventory intelligence
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Product analysis
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              A live overview of catalog health, pricing, and stock levels.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:self-auto">
            <span className="size-2 rounded-full bg-emerald-500" />
            Catalog overview
          </div>
        </header>

        <section
          aria-label="Product summary metrics"
          className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric, index) => {
            const { icon: Icon, iconClass, accent } = metricStyles[index];
            return (
              <article
                key={metric.label}
                className="relative min-h-34.5 overflow-hidden border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                style={{ borderTopColor: accent, borderTopWidth: 3 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-[26px] font-semibold leading-none tracking-tight text-slate-950">
                      {metric.value}
                    </p>
                  </div>
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center ${iconClass}`}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">{metric.detail}</p>
              </article>
            );
          })}
        </section>

        <section
          aria-label="Product charts"
          className="mb-8 grid gap-4 lg:grid-cols-2"
        >
          <article className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-950">
                Products by category
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Largest categories by number of products.
              </p>
            </div>
            <div className="space-y-4 px-5 py-5">
              {mostPopulatedCategories.length ? (
                mostPopulatedCategories.map((category) => (
                  <div key={category.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-slate-700">
                        {category.name}
                      </span>
                      <span className="shrink-0 tabular-nums text-slate-500">
                        {number.format(category.products)}
                      </span>
                    </div>
                    <div
                      role="meter"
                      aria-label={`${category.name} products`}
                      aria-valuemin={0}
                      aria-valuemax={largestCategoryCount}
                      aria-valuenow={category.products}
                      className="h-2 overflow-hidden bg-slate-100"
                    >
                      <div
                        className="h-full bg-emerald-600"
                        style={{
                          width: `${(category.products / largestCategoryCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  Add products to see category comparisons.
                </p>
              )}
            </div>
          </article>

          <article className="border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-950">
                Stock health
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Product count by current inventory level.
              </p>
            </div>
            <div className="flex flex-col items-center gap-6 px-5 py-6 sm:flex-row sm:justify-center">
              <div
                role="img"
                aria-label={`Stock health: ${summary.healthyStock.length} healthy, ${summary.lowStock.length} low stock, ${summary.outOfStock.length} out of stock`}
                className="relative size-40 shrink-0 rounded-full"
                style={{ background: stockHealthBackground }}
              >
                <div className="absolute inset-4.5 flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-2xl font-semibold tabular-nums text-slate-950">
                    {number.format(stockHealthTotal)}
                  </span>
                  <span className="text-xs text-slate-500">products</span>
                </div>
              </div>
              <div className="w-full max-w-xs space-y-3">
                {[
                  {
                    label: `Healthy stock (>${LOW_STOCK_LIMIT})`,
                    value: summary.healthyStock.length,
                    color: "bg-green-600",
                  },
                  {
                    label: `Low stock (1-${LOW_STOCK_LIMIT})`,
                    value: summary.lowStock.length,
                    color: "bg-amber-500",
                  },
                  {
                    label: "Out of stock",
                    value: summary.outOfStock.length,
                    color: "bg-rose-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className={`size-2.5 shrink-0 ${item.color}`} />
                      {item.label}
                    </span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {number.format(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>

        <section
          aria-labelledby="category-title"
          className="mb-8 border border-slate-200 bg-white"
        >
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="category-title"
                className="text-base font-semibold text-slate-950"
              >
                Category performance
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Compare catalog size, pricing, and inventory by category.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {number.format(products.length)} products analyzed
            </span>
          </div>
          {summary.categorySummaries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Products
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Avg Price
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Stock
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Avg Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.categorySummaries.map((category) => (
                    <tr
                      key={category.name}
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 font-semibold text-slate-800"
                      >
                        {category.name}
                      </th>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                        {number.format(category.products)}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                        {currency.format(category.averagePrice)}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                        {number.format(category.stock)}
                      </td>
                      <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                        <span className="inline-flex items-center justify-end gap-1.5">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-500"
                          />
                          {category.averageRating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <Boxes className="mx-auto mb-2 text-slate-400" size={28} />
              <p className="text-sm font-medium text-slate-700">
                No products in the catalog yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Category performance will appear when products are added.
              </p>
            </div>
          )}
        </section>

        <section
          aria-label="Inventory alerts"
          className="grid gap-4 lg:grid-cols-2"
        >
          <div className="border border-rose-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center bg-rose-50 text-rose-700">
                  <PackageX size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Out of stock
                  </h2>
                  <p className="text-xs text-slate-500">
                    Products with no available units
                  </p>
                </div>
              </div>
              <span className="text-lg font-semibold tabular-nums text-rose-700">
                {number.format(summary.outOfStock.length)}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {summary.outOfStock.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <p className="truncate text-sm font-medium text-slate-800">
                    {product.title ?? "Untitled product"}
                  </p>
                  <span className="shrink-0 text-xs font-semibold text-rose-700">
                    0 units
                  </span>
                </div>
              ))}
              {summary.outOfStock.length === 0 && (
                <p className="px-5 py-5 text-sm text-slate-500">
                  Everything has stock available.
                </p>
              )}
            </div>
          </div>

          <div className="border border-amber-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center bg-amber-50 text-amber-700">
                  <AlertTriangle size={17} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Low stock
                  </h2>
                  <p className="text-xs text-slate-500">{`Products with 1-${LOW_STOCK_LIMIT} units remaining`}</p>
                </div>
              </div>
              <span className="text-lg font-semibold tabular-nums text-amber-700">
                {number.format(summary.lowStock.length)}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {summary.lowStock.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <p className="truncate text-sm font-medium text-slate-800">
                    {product.title ?? "Untitled product"}
                  </p>
                  <span className="shrink-0 text-xs font-semibold text-amber-700">
                    {number.format(product.stock ?? 0)} units
                  </span>
                </div>
              ))}
              {summary.lowStock.length === 0 && (
                <p className="px-5 py-5 text-sm text-slate-500">
                  No products are below the low-stock threshold.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
