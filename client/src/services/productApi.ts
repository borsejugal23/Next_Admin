import type {
  Product,
  ProductDetailResponse,
  ProductsResponse,
} from "@/types/product";
import { PRODUCT_FILTER_PARAM_KEYS } from "@/lib/product-filters";
import { PRODUCT_SORT_PARAM_KEY } from "@/lib/product-sort";

const productApi = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
  stock?: string[];
  sort?: string;
};

function buildProductsQuery(params: GetProductsParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });

  const search = params.search?.trim();
  if (search) {
    searchParams.set("search", search);
  }

  if (params.categories?.length) {
    searchParams.set(
      PRODUCT_FILTER_PARAM_KEYS.Category,
      params.categories.join(","),
    );
  }

  if (params.stock?.length) {
    searchParams.set(PRODUCT_FILTER_PARAM_KEYS.Stock, params.stock.join(","));
  }

  if (params.sort?.trim()) {
    searchParams.set(PRODUCT_SORT_PARAM_KEY, params.sort.trim());
  }

  return searchParams.toString();
}

async function parseProductResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.replace("/sign-in");
    }
    throw new Error(data.message || "Unable to load product data");
  }

  return data;
}

export const getProducts = async (
  params: GetProductsParams,
): Promise<ProductsResponse> => {
  const response = await fetch(`${productApi}?${buildProductsQuery(params)}`, {
    credentials: "include",
  });
  return parseProductResponse<ProductsResponse>(response);
};

export const getProductById = async (
  id: string,
): Promise<ProductDetailResponse> => {
  const response = await fetch(`${productApi}/${id}`, {
    credentials: "include",
  });
  return parseProductResponse<ProductDetailResponse>(response);
};

export const updateProduct = async (
  id: string,
  product: Product,
): Promise<Product> => {
  const response = await fetch(`${productApi}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(product),
  });
  return parseProductResponse<Product>(response);
};
