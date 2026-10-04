const STORAGE_KEY = "usersListPage";

export const setUsersListPage = (page: number) => {
  sessionStorage.setItem(STORAGE_KEY, String(page));
};

export const getUsersListPage = () =>
  typeof window === "undefined"
    ? "1"
    : (sessionStorage.getItem(STORAGE_KEY) ?? "1");
