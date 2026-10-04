"use client";

import { useUsers } from "@/hooks/useUsers";
import {
  applyCsvParamToParams,
  applyPageToParams,
  applySearchToParams,
  buildQueryUrl,
  getPageFromParams,
  getSearchFromParams,
} from "@/lib/list-query";
import {
  getSelectedUserFilters,
  parseUserFilterParam,
  USER_FILTER_PARAM_KEYS,
  type UserFilterMenuProps,
  type UserFilterType,
} from "@/lib/user-filters";
import { setUsersListPage } from "@/lib/users-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { UserListFilterType } from "@/types/filter";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FilterType = UserListFilterType;

const LIMIT = 9;

export function useUserList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = getPageFromParams(searchParams);
  const search = getSearchFromParams(searchParams);
  const filterSearch = searchParams.toString();
  const selectedFilters = useMemo(
    () => getSelectedUserFilters(searchParams),
    [filterSearch],
  );

  const { data, isLoading } = useUsers(page, LIMIT, search, selectedFilters);
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const [openFilter, setOpenFilter] = useState<UserFilterType | null>(null);

  useEffect(() => {
    setUsersListPage(page);
  }, [page]);

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

  const handleFilterSelect = useCallback((filter: UserFilterType) => {
    setOpenFilter((current) => (current === filter ? null : filter));
  }, []);

  const handleFilterClose = useCallback(() => {
    setOpenFilter(null);
  }, []);

  const handleFilterSelectOptions = useCallback(
    (filter: UserFilterType, value: string, checked: boolean) => {
      const currentValues = parseUserFilterParam(searchParams, filter);
      const updatedValues = checked
        ? [...new Set([...currentValues, value])]
        : currentValues.filter((item) => item !== value);

      const params = new URLSearchParams(searchParams.toString());
      applyCsvParamToParams(
        params,
        USER_FILTER_PARAM_KEYS[filter],
        updatedValues,
      );
      router.replace(buildQueryUrl(pathname, params));
    },
    [pathname, router, searchParams],
  );

  const getFilterMenuProps = useCallback(
    <TFilter extends UserFilterType>(
      filter: TFilter,
    ): UserFilterMenuProps<TFilter> => ({
      filterFor: filter,
      openFilter: openFilter === filter,
      selectedFilters: selectedFilters[filter],
      onToggle: () => handleFilterSelect(filter),
      onSelect: (value, checked) =>
        handleFilterSelectOptions(filter, value, checked),
      onClose: handleFilterClose,
    }),
    [
      openFilter,
      selectedFilters,
      handleFilterSelect,
      handleFilterSelectOptions,
      handleFilterClose,
    ],
  );

  return {
    page,
    search,
    users,
    total,
    isLoading,
    limit: LIMIT,
    showingFrom: total === 0 ? 0 : page * LIMIT - (LIMIT - 1),
    showingTo: Math.min(page * LIMIT, total),
    openFilter,
    selectedFilters,
    getFilterMenuProps,
    handleSearch,
    handlePageChange,
  };
}
