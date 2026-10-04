import { UserDetailTab } from "@/types/user";

export const USER_DETAIL_TABS = Object.values(UserDetailTab);

export const isUserDetailTab = (tab: string): tab is UserDetailTab =>
  USER_DETAIL_TABS.includes(tab as UserDetailTab);

export const DEFAULT_USER_DETAIL_TAB = UserDetailTab.ABOUT;
