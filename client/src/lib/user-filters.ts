import type { UserListFilterType } from "@/types/filter";

export const USER_FILTER_OPTIONS = {
  Role: ["Admin", "Moderator", "User"],
  Gender: ["Male", "Female"],
} as const;

export type UserFilterType = UserListFilterType;

export const USER_FILTER_PARAM_KEYS: Record<UserFilterType, string> = {
  Role: "role",
  Gender: "gender",
};

export function parseUserFilterParam(
  searchParams: URLSearchParams,
  filter: UserFilterType,
): string[] {
  const paramKey = USER_FILTER_PARAM_KEYS[filter];
  const raw = searchParams.get(paramKey);
  if (!raw) return [];

  const allowed = new Set<string>(USER_FILTER_OPTIONS[filter]);

  return [...new Set(raw.split(",").map((value) => value.trim()).filter(Boolean))]
    .filter((value) => allowed.has(value));
}

export function getSelectedUserFilters(searchParams: URLSearchParams) {
  return {
    Role: parseUserFilterParam(searchParams, "Role"),
    Gender: parseUserFilterParam(searchParams, "Gender"),
  };
}

export type SelectedUserFilters = ReturnType<typeof getSelectedUserFilters>;

/** Stable primitive key for React Query cache identity. */
export function getUserListFilterQueryKey(selectedFilters: SelectedUserFilters) {
  return {
    roles: selectedFilters.Role.slice().sort().join(","),
    genders: selectedFilters.Gender.slice().sort().join(","),
  };
}

/** Normalized values for GET /users query params (backend-ready). */
export function toUserListApiFilters(selectedFilters: SelectedUserFilters) {
  return {
    roles: selectedFilters.Role.map((value) => value.toLowerCase()),
    genders: selectedFilters.Gender.map((value) => value.toLowerCase()),
  };
}

export type UserFilterMenuProps<TFilter extends UserFilterType> = {
  filterFor: TFilter;
  openFilter: boolean;
  selectedFilters: SelectedUserFilters[TFilter];
  onToggle: () => void;
  onSelect: (value: string, checked: boolean) => void;
  onClose: () => void;
};
