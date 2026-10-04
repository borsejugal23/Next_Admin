export type ProductQuery = {
  operation?: "search" | "count";

  includeProducts?: boolean;

  filters?: {
    title?: string;
    description?: string;
    category?: string;

    price?: {
      min?: number;
      max?: number;
    };

    discountPercentage?: {
      min?: number;
      max?: number;
    };

    rating?: {
      min?: number;
      max?: number;
    };

    stock?: {
      min?: number;
      max?: number;
    };

    tags?: string[];
    brand?: string;
    availabilityStatus?: string;
  };

  search?: string;

  sort?: {
    field: "price" | "discountPercentage" | "rating" | "stock" | "title";
    order: "asc" | "desc";
  };

  limit?: number;
};
