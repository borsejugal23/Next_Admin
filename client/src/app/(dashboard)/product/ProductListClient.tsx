"use client";

import FilterMenu from "@/components/FilterMenu";
import ListSortSelect from "@/components/ListSortSelect";
import Pagination from "@/components/pagination";
import ProductTable from "@/components/product/ProductTable";
import SearchBar from "@/components/SearchBar";
import { useProductList } from "@/hooks/useProductList";
import { PRODUCT_FILTER_OPTIONS } from "@/lib/product-filters";
import { LoaderCircle } from "lucide-react";

export default function ProductListClient() {
  const {
    search,
    products,
    total,
    isLoading,
    page,
    limit,
    showingFrom,
    showingTo,
    categories,
    sort,
    getFilterMenuProps,
    handlePageChange,
    handleSearch,
    handleSortChange,
  } = useProductList();

  return (
    <div className="w-full bg-white p-4">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-medium text-gray-900">Products</p>
          <p className="text-sm text-gray-500">
            Browse inventory with quick overview details
          </p>
        </div>
        <SearchBar
          value={search}
          onSearch={handleSearch}
          placeholder="Search products..."
          className="w-full sm:w-72"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-4">
        <p className="text-sm font-medium text-gray-500">Filter By</p>
        <FilterMenu
          {...getFilterMenuProps("Category")}
          filterOptions={categories}
        />
        <FilterMenu
          {...getFilterMenuProps("Stock")}
          filterOptions={PRODUCT_FILTER_OPTIONS.Stock}
        />
        <ListSortSelect
          className="ml-auto"
          align="right"
          value={sort}
          onChange={handleSortChange}
        />
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70">
            <LoaderCircle className="animate-spin" size={40} color="#7777E7" />
          </div>
        )}

        {products.length > 0 ? (
          <ProductTable products={products} />
        ) : !isLoading ? (
          <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
            <p className="text-lg font-medium text-gray-900">
              No products found
            </p>
          </div>
        ) : (
          <div className="min-h-[calc(100vh-14rem)] rounded-xl border border-gray-200" />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-sm font-medium text-gray-500">
          Showing {showingFrom} to {showingTo} of {total} products
        </p>
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
