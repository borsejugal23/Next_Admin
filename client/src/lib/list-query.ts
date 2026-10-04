export const SEARCH_PARAM_KEY = "search";

export function buildQueryUrl(pathname: string, params: URLSearchParams) {
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function getPageFromParams(searchParams: URLSearchParams) {
  return Math.max(1, Number(searchParams.get("page")) || 1);
}

export function getSearchFromParams(searchParams: URLSearchParams) {
  return (searchParams.get(SEARCH_PARAM_KEY) ?? "").trim();
}

export function applyPageToParams(params: URLSearchParams, page: number) {
  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
}

export function applySearchToParams(params: URLSearchParams, search: string) {
  const trimmed = search.trim();

  if (trimmed) {
    params.set(SEARCH_PARAM_KEY, trimmed);
  } else {
    params.delete(SEARCH_PARAM_KEY);
  }

  params.delete("page");
}

export function applyCsvParamToParams(
  params: URLSearchParams,
  key: string,
  values: string[],
) {
  if (values.length > 0) {
    params.set(key, values.join(","));
  } else {
    params.delete(key);
  }

  params.delete("page");
}
