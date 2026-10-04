"use client";

import { useProducts } from "@/hooks/useProduct";
import {
  applyCsvParamToParams,
  applyPageToParams,
  applySearchToParams,
  buildQueryUrl,
  getPageFromParams,
  getSearchFromParams,
} from "@/lib/list-query";
import {
  getSelectedProductFilters,
  parseProductFilterParam,
  PRODUCT_FILTER_PARAM_KEYS,
  type ProductFilterMenuProps,
} from "@/lib/product-filters";
import type { ProductListFilterType } from "@/types/filter";
import {
  applyProductSortToParams,
  getProductSortFromParams,
  type ProductSortValue,
} from "@/lib/product-sort";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const LIMIT = 7;

export function useProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = getPageFromParams(searchParams);
  const search = getSearchFromParams(searchParams);
  const sort = getProductSortFromParams(searchParams);
  const filterSearch = searchParams.toString();
  const selectedFilters = useMemo(
    () => getSelectedProductFilters(searchParams),
    [filterSearch],
  );

  const { data, isLoading } = useProducts(
    page,
    LIMIT,
    search,
    selectedFilters,
    sort,
  );
  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const categories = data?.categories ?? [];
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const [openFilter, setOpenFilter] = useState<ProductListFilterType | null>(
    null,
  );

  useEffect(() => {
    if (isLoading || total === 0 || page <= totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    applyPageToParams(params, totalPages);
    router.replace(buildQueryUrl(pathname, params));
  }, [isLoading, page, pathname, router, searchParams, total, totalPages]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      applyPageToParams(params, nextPage);
      router.push(buildQueryUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      const nextSearch = value.trim();
      const currentSearch = getSearchFromParams(searchParams);

      if (nextSearch === currentSearch) return;

      const params = new URLSearchParams(searchParams.toString());
      applySearchToParams(params, nextSearch);
      router.push(buildQueryUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  const handleFilterSelect = useCallback((filter: ProductListFilterType) => {
    setOpenFilter((current) => (current === filter ? null : filter));
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(null);
  }, []);

  const handleFilterSelectOptions = useCallback(
    (filter: ProductListFilterType, value: string, checked: boolean) => {
      const currentValues = parseProductFilterParam(searchParams, filter);
      const updatedValues = checked
        ? [...new Set([...currentValues, value])]
        : currentValues.filter((item) => item !== value);

      const params = new URLSearchParams(searchParams.toString());
      applyCsvParamToParams(
        params,
        PRODUCT_FILTER_PARAM_KEYS[filter],
        updatedValues,
      );
      router.replace(buildQueryUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  const handleSortChange = useCallback(
    (nextSort: ProductSortValue) => {
      const params = new URLSearchParams(searchParams.toString());
      applyProductSortToParams(params, nextSort);
      router.replace(buildQueryUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  const getFilterMenuProps = useCallback(
    <TFilter extends ProductListFilterType>(
      filter: TFilter,
    ): ProductFilterMenuProps<TFilter> => ({
      filterFor: filter,
      openFilter: openFilter === filter,
      selectedFilters: selectedFilters[filter],
      onToggle: () => handleFilterSelect(filter),
      onSelect: (value, checked) =>
        handleFilterSelectOptions(filter, value, checked),
      onClose: handleCloseFilter,
    }),
    [
      openFilter,
      selectedFilters,
      handleFilterSelect,
      handleFilterSelectOptions,
      handleCloseFilter,
    ],
  );

  return {
    page,
    search,
    products,
    total,
    isLoading,
    limit: LIMIT,
    showingFrom: total === 0 ? 0 : page * LIMIT - (LIMIT - 1),
    showingTo: Math.min(page * LIMIT, total),
    categories,
    openFilter,
    selectedFilters,
    sort,
    getFilterMenuProps,
    handlePageChange,
    handleSearch,
    handleSortChange,
  };
}
