import UserModel from "../models/user.model";
import ProductModel from "../models/product.model";

export const DEFAULT_USER_LIMIT = 10;

type ListUsersParams = {
  search?: string;
  page: number;
  limit: number;
  roles?: string[];
  genders?: string[];
};

export function parseCsvQueryParam(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value.flatMap((item) => String(item).trim()).filter(Boolean),
      ),
    ];
  }

  if (typeof value === "string" && value.trim()) {
    return [
      ...new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  return [];
}

export async function listUsers({
  search,
  page,
  limit,
  roles = [],
  genders = [],
}: ListUsersParams) {
  const trimmedSearch = search?.trim() ?? "";
  const filters: Record<string, unknown>[] = [];

  if (trimmedSearch) {
    filters.push({
      $or: [
        { firstName: { $regex: trimmedSearch, $options: "i" } },
        { lastName: { $regex: trimmedSearch, $options: "i" } },
        { email: { $regex: trimmedSearch, $options: "i" } },
      ],
    });
  }

  if (roles.length > 0) {
    filters.push({ role: { $in: roles } });
  }

  if (genders.length > 0) {
    filters.push({ gender: { $in: genders } });
  }

  const whereClause =
    filters.length > 0
      ? filters.length === 1
        ? filters[0]
        : { $and: filters }
      : {};

  const [users, total] = await Promise.all([
    UserModel.find(whereClause)
      .select("id firstName lastName email role gender company phone image")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ id: 1 }),

    UserModel.countDocuments(whereClause),
  ]);

  return { users, total, page, limit };
}

export async function getUserById(id: string) {
  return UserModel.findById(id);
}

export async function getUserReviewByEmail(email: string) {
  return ProductModel.aggregate([
    {
      $match: {
        "reviews.reviewerEmail": email,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        title: 1,
        reviews: {
          $filter: {
            input: "$reviews",
            as: "review",
            cond: { $eq: ["$$review.reviewerEmail", email] },
          },
        },
      },
    },
  ]);
}
