import productModel from "../models/product.model";
import { ProductQuery } from "../types/product-query.types";

const DEFAULT_CHAT_LIMIT = 5;
const MAX_CHAT_LIMIT = 20;

const PRODUCT_FIELDS =
  "id title description category price discountPercentage rating stock brand availabilityStatus thumbnail";

export const buildProductFilter = (query: ProductQuery) => {
  const filter: Record<string, unknown> = {};
  const andConditions: Record<string, unknown>[] = [];

  if (query.search?.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    andConditions.push({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ],
    });
  }

  if (query.filters?.title) {
    filter.title = { $regex: query.filters.title, $options: "i" };
  }

  if (query.filters?.description) {
    filter.description = { $regex: query.filters.description, $options: "i" };
  }

  if (query.filters?.price) {
    const { min, max } = query.filters.price;

    if (min !== undefined || max !== undefined) {
      filter.price = {};

      if (min !== undefined) {
        (filter.price as Record<string, number>).$gte = min;
      }

      if (max !== undefined) {
        (filter.price as Record<string, number>).$lte = max;
      }
    }
  }

  if (query.filters?.category) {
    filter.category = { $regex: query.filters.category, $options: "i" };
  }

  if (query.filters?.brand) {
    filter.brand = { $regex: query.filters.brand, $options: "i" };
  }

  if (query.filters?.availabilityStatus) {
    filter.availabilityStatus = {
      $regex: query.filters.availabilityStatus,
      $options: "i",
    };
  }

  if (query.filters?.rating) {
    const { min, max } = query.filters.rating;

    if (min !== undefined || max !== undefined) {
      filter.rating = {};

      if (min !== undefined) {
        (filter.rating as Record<string, number>).$gte = min;
      }

      if (max !== undefined) {
        (filter.rating as Record<string, number>).$lte = max;
      }
    }
  }

  if (query.filters?.stock) {
    const { min, max } = query.filters.stock;

    if (min !== undefined || max !== undefined) {
      filter.stock = {};

      if (min !== undefined) {
        (filter.stock as Record<string, number>).$gte = min;
      }

      if (max !== undefined) {
        (filter.stock as Record<string, number>).$lte = max;
      }
    }
  }

  if (query.filters?.discountPercentage) {
    const { min, max } = query.filters.discountPercentage;

    if (min !== undefined || max !== undefined) {
      filter.discountPercentage = {};

      if (min !== undefined) {
        (filter.discountPercentage as Record<string, number>).$gte = min;
      }

      if (max !== undefined) {
        (filter.discountPercentage as Record<string, number>).$lte = max;
      }
    }
  }

  if (query.filters?.tags?.length) {
    filter.tags = { $in: query.filters.tags };
  }

  if (andConditions.length) {
    return { $and: [...andConditions, filter] };
  }

  return filter;
};

const buildSort = (query: ProductQuery): Record<string, 1 | -1> => {
  if (!query.sort) {
    return { id: 1 as const };
  }

  return {
    [query.sort.field]: query.sort.order === "desc" ? -1 : 1,
  };
};

export const searchProducts = async (query: ProductQuery) => {
  const filter = buildProductFilter(query);

  if (query.operation === "count") {
    const count = await productModel.countDocuments(filter);

    return { count };
  }

  const limit = Math.min(query.limit ?? DEFAULT_CHAT_LIMIT, MAX_CHAT_LIMIT);
  const sort = buildSort(query);

  const [products, total] = await Promise.all([
    productModel
      .find(filter)
      .select(PRODUCT_FIELDS)
      .sort(sort)
      .limit(limit)
      .lean(),
    productModel.countDocuments(filter),
  ]);

  return {
    products,
    total,
  };
};
