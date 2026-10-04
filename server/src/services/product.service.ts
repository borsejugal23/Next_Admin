import ProductModel from "../models/product.model";
import { Product } from "../types/product";
import { getIO } from "../socket/socket";

export const DEFAULT_PRODUCT_LIMIT = 10;

type ListProductsParams = {
  search?: string;
  page: number;
  limit: number;
  categoryFilters?: string[];
  stockFilters?: string[];
  sort?: string;
};

export function resolveProductSort(sort?: string): Record<string, 1 | -1> {
  const normalized = sort?.trim().toLowerCase() ?? "";
  if (!normalized) return { id: 1 };

  const [field, direction] = normalized.split("-");
  const order: 1 | -1 = direction === "desc" ? -1 : 1;

  switch (field) {
    case "price":
    case "stock":
    case "rating":
      return { [field]: order, id: 1 };
    default:
      return { id: 1 };
  }
}

function buildStockFilter(
  stockFilters: string[],
): Record<string, unknown> | null {
  const conditions: Record<string, unknown>[] = [];

  for (const value of stockFilters) {
    const normalized = value.trim().toLowerCase();

    if (normalized === "in stock") {
      conditions.push({ stock: { $gt: 0 } });
      continue;
    }

    if (normalized === "out of stock") {
      conditions.push({
        $or: [
          { stock: { $lte: 0 } },
          { stock: { $exists: false } },
          { stock: null },
        ],
      });
    }
  }

  if (conditions.length === 0) return null;
  if (conditions.length === 1) return conditions[0];
  return { $or: conditions };
}

export async function listProducts({
  search,
  page,
  limit,
  categoryFilters = [],
  stockFilters = [],
  sort,
}: ListProductsParams) {
  const trimmedSearch = search?.trim() ?? "";
  const filters: Record<string, unknown>[] = [];

  if (trimmedSearch) {
    filters.push({ title: { $regex: trimmedSearch, $options: "i" } });
  }

  if (categoryFilters.length > 0) {
    filters.push({ category: { $in: categoryFilters } });
  }

  const stockFilter = buildStockFilter(stockFilters);
  if (stockFilter) {
    filters.push(stockFilter);
  }

  const whereClause =
    filters.length > 0
      ? filters.length === 1
        ? filters[0]
        : { $and: filters }
      : {};

  const sortClause = resolveProductSort(sort);

  const [products, total] = await Promise.all([
    ProductModel.find(whereClause)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortClause),
    ProductModel.countDocuments(whereClause),
  ]);
  const categories = await ProductModel.distinct("category");

  return { products, total, page, limit, categories };
}

export async function getProductById(id: string) {
  const [product, categories] = await Promise.all([
    ProductModel.findById(id),
    ProductModel.distinct("category"),
  ]);

  if (!product) return null;

  return {
    product,
    categories: categories.filter(Boolean).sort(),
  };
}

export async function updateProduct(id: string, update: Partial<Product>) {
  const product = await ProductModel.findByIdAndUpdate(id, update, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!product) return null;

  getIO().emit("productUpdated", {
    id: product._id,
    title: product.title,
    updatedAt: product.updatedAt,
  });

  return product;
}
