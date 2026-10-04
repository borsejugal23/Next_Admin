import type { User, UsersResponse } from "@/types/user";
import { USER_FILTER_PARAM_KEYS } from "@/lib/user-filters";

const userApi = `${process.env.NEXT_PUBLIC_BASE_URL}/users`;

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  roles?: string[];
  genders?: string[];
};

function buildUsersQuery(params: GetUsersParams): string {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });

  const search = params.search?.trim();
  if (search) {
    searchParams.set("search", search);
  }

  if (params.roles?.length) {
    searchParams.set(USER_FILTER_PARAM_KEYS.Role, params.roles.join(","));
  }

  if (params.genders?.length) {
    searchParams.set(USER_FILTER_PARAM_KEYS.Gender, params.genders.join(","));
  }

  return searchParams.toString();
}

export const getUsers = async (params: GetUsersParams): Promise<UsersResponse> => {
  const response = await fetch(`${userApi}?${buildUsersQuery(params)}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch users");
  }

  return response.json();
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${userApi}/${id}`, {
    credentials: "include",
  });
  return response.json();
};

export const getUserReviewByEmail = async (email: string) => {
  const response = await fetch(`${userApi}/review?email=${email}`, {
    credentials: "include",
  });
  return response.json();
};
