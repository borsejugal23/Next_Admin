import { ProductQuery } from "../types/product-query.types";

const COUNT_PATTERNS =
  /\b(how many|count|number of|total)\b.*\b(products?|items?)\b/i;

const GLOBAL_COUNT_PATTERNS = [
  /\b(total|overall)\s+(products?|items?)\s*(count)?\b/i,
  /\b(products?|items?)\s+count\b/i,
  /\bhow many\s+(products?|items?)\s*(are there|do you have|in total|in all|total|overall)?\b/i,
  /\b(count|number of)\s+(all\s+)?(products?|items?)\b/i,
  /\b(total|overall)\s+count\b/i,
];

const COUNT_META_WORDS = new Set([
  "count",
  "total",
  "overall",
  "there",
  "many",
  "all",
]);

const PRICE_UNDER = /\b(under|below|less than|cheaper than|max|up to)\s*\$?\s*(\d+(?:\.\d+)?)/i;
const PRICE_OVER = /\b(over|above|more than|at least|min|from)\s*\$?\s*(\d+(?:\.\d+)?)/i;
const PRICE_BETWEEN =
  /\b(between|from)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?\s*(\d+(?:\.\d+)?)/i;
const PRICE_EXACT = /\$\s*(\d+(?:\.\d+)?)/g;

const RATING_MIN =
  /\b(rated?|rating|stars?)\s*(above|over|at least|>=?|more than)?\s*(\d(?:\.\d+)?)/i;
const RATING_BEST = /\b(best rated|top rated|highest rated|highest rating)\b/i;

const SORT_CHEAP = /\b(cheapest|lowest price|least expensive)\b/i;
const SORT_EXPENSIVE = /\b(most expensive|highest price|priciest)\b/i;
const SORT_RATING = /\b(best rated|top rated|highest rated|highest rating)\b/i;

const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "show",
  "me",
  "find",
  "get",
  "list",
  "give",
  "what",
  "which",
  "are",
  "is",
  "do",
  "you",
  "have",
  "any",
  "some",
  "all",
  "products",
  "product",
  "items",
  "item",
  "please",
  "can",
  "i",
  "want",
  "need",
  "looking",
  "for",
  "with",
  "in",
  "on",
  "of",
  "and",
  "or",
]);

function isGlobalCountQuery(message: string): boolean {
  return GLOBAL_COUNT_PATTERNS.some((pattern) => pattern.test(message));
}

function isMetaSearchTerm(search: string): boolean {
  const words = search.toLowerCase().split(/\s+/);
  return words.every((word) => COUNT_META_WORDS.has(word));
}

function extractCategory(message: string): string | undefined {
  const lower = message.toLowerCase();

  return CATEGORIES.find((category) => {
    const label = category.replace(/-/g, " ");
    return lower.includes(category) || lower.includes(label);
  });
}

function extractSearchTerms(message: string): string | undefined {
  const cleaned = message
    .replace(COUNT_PATTERNS, "")
    .replace(PRICE_UNDER, "")
    .replace(PRICE_OVER, "")
    .replace(PRICE_BETWEEN, "")
    .replace(RATING_MIN, "")
    .replace(RATING_BEST, "")
    .replace(SORT_CHEAP, "")
    .replace(SORT_EXPENSIVE, "")
    .replace(SORT_RATING, "")
    .replace(/\$?\d+(?:\.\d+)?/g, "")
    .replace(/[^\w\s-]/g, " ")
    .trim();

  const words = cleaned
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  if (!words.length) {
    return undefined;
  }

  return words.join(" ");
}

export function parseProductQuery(message: string): ProductQuery {
  if (isGlobalCountQuery(message)) {
    return {
      operation: "count",
      includeProducts: false,
    };
  }

  const query: ProductQuery = {
    operation: "search",
    includeProducts: true,
    limit: 5,
  };

  if (COUNT_PATTERNS.test(message)) {
    query.operation = "count";
    query.includeProducts = false;
    delete query.limit;
  }

  const betweenMatch = message.match(PRICE_BETWEEN);
  if (betweenMatch) {
    query.filters = {
      ...query.filters,
      price: {
        min: Number(betweenMatch[2]),
        max: Number(betweenMatch[3]),
      },
    };
  } else {
    const underMatch = message.match(PRICE_UNDER);
    if (underMatch) {
      query.filters = {
        ...query.filters,
        price: { max: Number(underMatch[2]) },
      };
    }

    const overMatch = message.match(PRICE_OVER);
    if (overMatch) {
      query.filters = {
        ...query.filters,
        price: {
          ...query.filters?.price,
          min: Number(overMatch[2]),
        },
      };
    }
  }

  const ratingMatch = message.match(RATING_MIN);
  if (ratingMatch) {
    query.filters = {
      ...query.filters,
      rating: { min: Number(ratingMatch[3]) },
    };
  } else if (RATING_BEST.test(message)) {
    query.filters = {
      ...query.filters,
      rating: { min: 4 },
    };
    query.sort = { field: "rating", order: "desc" };
  }

  const category = extractCategory(message);
  if (category) {
    query.filters = {
      ...query.filters,
      category,
    };
  }

  if (SORT_CHEAP.test(message)) {
    query.sort = { field: "price", order: "asc" };
  } else if (SORT_EXPENSIVE.test(message)) {
    query.sort = { field: "price", order: "desc" };
  } else if (SORT_RATING.test(message) && !query.sort) {
    query.sort = { field: "rating", order: "desc" };
  }

  const search = extractSearchTerms(message);
  const hasFilters = Boolean(
    query.filters &&
      Object.values(query.filters).some((value) => value !== undefined),
  );

  if (
    search &&
    !isRedundantSearch(search, query.filters?.category) &&
    !(query.operation === "count" && !hasFilters && isMetaSearchTerm(search))
  ) {
    query.search = search;
  }

  return query;
}

function isRedundantSearch(search: string, category?: string): boolean {
  if (!category) {
    return false;
  }

  const normalizedSearch = search.toLowerCase().trim();
  const normalizedCategory = category.toLowerCase();
  const categoryLabel = normalizedCategory.replace(/-/g, " ");

  return (
    normalizedSearch === normalizedCategory ||
    normalizedSearch === categoryLabel ||
    normalizedSearch === `${categoryLabel} category` ||
    normalizedSearch === `${normalizedCategory} category`
  );
}

export function formatProductAnswer(
  message: string,
  result: { count?: number; products?: Array<Record<string, unknown>>; total?: number },
): string {
  if (typeof result.count === "number") {
    if (result.count === 0) {
      return "I couldn't find any products matching your criteria.";
    }

    const isGlobalCount = GLOBAL_COUNT_PATTERNS.some((pattern) =>
      pattern.test(message),
    );

    if (isGlobalCount) {
      return `There ${result.count === 1 ? "is" : "are"} ${result.count} product${result.count === 1 ? "" : "s"} in the catalog.`;
    }

    return `There ${result.count === 1 ? "is" : "are"} ${result.count} product${result.count === 1 ? "" : "s"} matching your search.`;
  }

  const products = result.products ?? [];

  if (!products.length) {
    return "I couldn't find any products matching your search. Try broadening your filters or using different keywords.";
  }

  const total = result.total ?? products.length;
  const preview = products.slice(0, 5);
  const lines = preview.map((product) => {
    const title = product.title ?? "Unknown product";
    const price =
      typeof product.price === "number" ? `$${product.price}` : "price unavailable";
    const rating =
      typeof product.rating === "number" ? `rating ${product.rating}` : "no rating";

    return `• ${title} — ${price} (${rating})`;
  });

  const header =
    total > preview.length
      ? `I found ${total} products. Here are the top ${preview.length}:`
      : `I found ${total} product${total === 1 ? "" : "s"}:`;

  return [header, ...lines].join("\n");
}
