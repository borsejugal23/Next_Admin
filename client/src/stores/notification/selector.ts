import type { RootState } from "@/stores";

export const selectNotificationState = (state: RootState) =>
  state.notification;

export const selectNotifications = (state: RootState) =>
  state.notification.notifications;

export const selectUnreadCount = (state: RootState) =>
  state.notification.unreadCount;

export const selectHasUnreadNotifications = (state: RootState) =>
  state.notification.unreadCount > 0;
