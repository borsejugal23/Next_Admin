import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Notification = {
  id: string;
  message: string;
  isRead: boolean;
  updatedAt: string;
};

export type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
};

export type AddNotificationPayload = Omit<Notification, "id" | "isRead"> & {
  id?: string;
};

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<AddNotificationPayload>) {
      const notification: Notification = {
        id: action.payload.id ?? crypto.randomUUID(),
        message: action.payload.message,
        updatedAt: action.payload.updatedAt,
        isRead: false,
      };

      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },

    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(
        (item) => item.id === action.payload,
      );

      if (!notification || notification.isRead) return;

      notification.isRead = true;
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },

    markAllNotificationsAsRead(state) {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },

    removeNotification(state, action: PayloadAction<string>) {
      const index = state.notifications.findIndex(
        (item) => item.id === action.payload,
      );

      if (index === -1) return;

      if (!state.notifications[index].isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }

      state.notifications.splice(index, 1);
    },

    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
