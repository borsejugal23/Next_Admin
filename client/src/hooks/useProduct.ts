"use client";

import { productKeys } from "@/lib/query-keys";
import {
  toProductListApiFilters,
  type SelectedProductFilters,
} from "@/lib/product-filters";
import {
  getProductById,
  getProducts,
  updateProduct,
} from "@/services/productApi";
import type { Product, ProductDetailResponse } from "@/types/product";
import toast from "react-hot-toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const EMPTY_FILTERS: SelectedProductFilters = { Category: [], Stock: [] };

export const useProducts = (
  page: number,
  limit: number,
  search = "",
  selectedFilters: SelectedProductFilters = EMPTY_FILTERS,
  sort = "",
) => {
  const { categories, stock } = toProductListApiFilters(selectedFilters);

  return useQuery({
    queryKey: productKeys.list(page, limit, search, selectedFilters, sort),
    queryFn: () =>
      getProducts({ page, limit, search, categories, stock, sort }),
    placeholderData: keepPreviousData,
  });
};

export const useProduct = (id: string) =>
  useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    // enabled: Boolean(id),
  });

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Product) => updateProduct(id, product),
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<ProductDetailResponse>(
        productKeys.detail(id),
        (current) => {
          return {
            product: updatedProduct,
            categories: current?.categories ?? [],
          };
        },
      );
      toast.success("Product updated successfully");
    },
    onError: (error) => toast.error(error.message),
  });
};
