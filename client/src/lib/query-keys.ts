import {
  getProductListFilterQueryKey,
  type SelectedProductFilters,
} from "@/lib/product-filters";
import {
  getUserListFilterQueryKey,
  type SelectedUserFilters,
} from "@/lib/user-filters";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (
    page: number,
    limit: number,
    search = "",
    selectedFilters: SelectedUserFilters = { Role: [], Gender: [] },
  ) =>
    [
      ...userKeys.lists(),
      {
        page,
        limit,
        search,
        ...getUserListFilterQueryKey(selectedFilters),
      },
    ] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  cart: (userId: number | string) => [...userKeys.all, "cart", userId] as const,
  review: (email: string) => [...userKeys.all, "review", email] as const,
};

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (
    page: number,
    limit: number,
    search = "",
    selectedFilters: SelectedProductFilters = { Category: [], Stock: [] },
    sort = "",
  ) =>
    [
      ...productKeys.lists(),
      {
        page,
        limit,
        search,
        sort,
        ...getProductListFilterQueryKey(selectedFilters),
      },
    ] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const panelUserKeys = {
  all: ["panelUsers"] as const,
  lists: () => [...panelUserKeys.all, "list"] as const,
  list: (page: number, limit: number, search = "") =>
    [...panelUserKeys.lists(), { page, limit, search }] as const,
  details: () => [...panelUserKeys.all, "detail"] as const,
  detail: (id: string) => [...panelUserKeys.details(), id] as const,
};
