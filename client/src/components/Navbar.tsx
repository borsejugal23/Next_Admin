"use client";

import { formatRoleLabel } from "@/lib/roles";
import { selectUnreadCount } from "@/stores/notification/selector";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import NotificationModal from "./notificaion/NotificationModal";
import UserProfileModal from "./panelUser/UserProfileModal";
import { selectPanelUser } from "@/stores/panelUser/selector";

export default function Navbar({
  isOpen,
  onSideMenuClick,
}: {
  isOpen: boolean;
  onSideMenuClick: () => void;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const unreadCount = useSelector(selectUnreadCount);
  const { name, email, role } = useSelector(selectPanelUser);
  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-4 bg-gray-100 p-3 shadow-md">
      {isOpen ? (
        <PanelLeftClose
          color="black"
          className="cursor-pointer"
          onClick={onSideMenuClick}
        />
      ) : (
        <PanelRightClose
          color="black"
          className="cursor-pointer"
          onClick={onSideMenuClick}
        />
      )}

      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold text-[#7777E7]">Dashboard</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={
              unreadCount > 0
                ? `Open notifications, ${unreadCount} unread`
                : "Open notifications"
            }
            onClick={() => setIsNotificationOpen(true)}
            className="relative ml-auto rounded-lg text-gray-700 transition hover:bg-gray-200 focus:outline-0"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </button>

          <div className={isUserProfileOpen ? "relative z-60" : "relative"}>
            <button
              type="button"
              aria-label="Open user profile"
              aria-expanded={isUserProfileOpen}
              onClick={() => setIsUserProfileOpen((open) => !open)}
              className="ml-auto flex items-center gap-3 rounded-lg text-left transition hover:bg-gray-100 focus:outline-none"
            >
              {/* Avatar */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {name.charAt(0).toUpperCase()}
              </span>

              {/* User details */}
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">{email}</span>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {formatRoleLabel(role)}
                  </span>
                  <span className="cursor-pointer hover:bg-gray-200 rounded-lg p-1">
                    {!isUserProfileOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isNotificationOpen ? (
        <NotificationModal onClose={() => setIsNotificationOpen(false)} />
      ) : null}

      {isUserProfileOpen ? (
        <UserProfileModal onClose={() => setIsUserProfileOpen(false)} />
      ) : null}
    </header>
  );
}
