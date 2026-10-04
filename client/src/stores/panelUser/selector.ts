import type { RootState } from "@/stores";

export const selectPanelUser = (state: RootState) => state.panelUser;
export const selectPanelUserRole = (state: RootState) => state.panelUser.role;
export const selectPanelUserAllowedRoles = (state: RootState) =>
  state.panelUser.allowedRoles;
