"use client";

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/stores/notification/reducer";
import { selectNotificationState } from "@/stores/notification/selector";
import { CheckCheck, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";

type NotificationModalProps = {
  onClose: () => void;
};

function formatTime(updatedAt: string) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) return updatedAt;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationModal({ onClose }: NotificationModalProps) {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(selectNotificationState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-start justify-end p-4 pt-16"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <button
        type="button"
        aria-label="Close notifications"
        className="absolute inset-0 bg-[#1a0e0e]/35 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(32rem,calc(100vh-5rem))] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#eae3de] bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#eae3de] px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-[#1a0e0e]">
              Notifications
            </h2>
            <p className="text-xs text-[#6e5f5d]">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "You're all caught up"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => dispatch(markAllNotificationsAsRead())}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-[#695BEB] transition hover:bg-[#F1EEFF]"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#6e5f5d] transition hover:bg-[#f7f0eb] hover:text-[#1a0e0e]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-[#6e5f5d]">
              No notifications yet.
            </p>
          ) : (
            <ul className="divide-y divide-[#eae3de]">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`px-4 py-3 ${
                    notification.isRead ? "bg-white" : "bg-[#F8F6FF]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {!notification.isRead ? (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#7950F2]" />
                        ) : null}
                        <p className="truncate text-sm font-semibold text-[#1a0e0e]">
                          Product updated
                        </p>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-[#3d2f2d]">
                        {notification.message}
                      </p>
                      <p className="mt-1.5 text-xs text-[#6e5f5d]">
                        {formatTime(notification.updatedAt)}
                      </p>
                    </div>

                    {!notification.isRead ? (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(markNotificationAsRead(notification.id))
                        }
                        className="shrink-0 rounded-lg border border-[#eae3de] px-2 py-1 text-xs font-medium text-[#1a0e0e] transition hover:bg-white"
                      >
                        Mark read
                      </button>
                    ) : (
                      <span className="shrink-0 text-xs text-[#6e5f5d]">
                        Read
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
