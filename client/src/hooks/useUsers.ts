"use client";

import {
  getUserById,
  getUsers,
  getUserReviewByEmail,
} from "@/services/userApi";
import { userKeys } from "@/lib/query-keys";
import {
  toUserListApiFilters,
  type SelectedUserFilters,
} from "@/lib/user-filters";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserCart } from "@/services/cartApi";

const EMPTY_FILTERS: SelectedUserFilters = { Role: [], Gender: [] };

export const useUsers = (
  page: number,
  limit: number,
  search = "",
  selectedFilters: SelectedUserFilters = EMPTY_FILTERS,
) => {
  const { roles, genders } = toUserListApiFilters(selectedFilters);

  return useQuery({
    queryKey: userKeys.list(page, limit, search, selectedFilters),
    queryFn: () => getUsers({ page, limit, search, roles, genders }),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id?: string) =>
  useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
  });

export const useUserCart = (userId?: number) =>
  useQuery({
    queryKey: userKeys.cart(userId ?? ""),
    queryFn: () => getUserCart(userId!),
    enabled: typeof userId === "number",
  });

export const useUserReview = (email?: string) =>
  useQuery({
    queryKey: userKeys.review(email ?? ""),
    queryFn: () => getUserReviewByEmail(email!),
    enabled: Boolean(email),
  });
