"use client";

import { CircleUser, LogOut, Repeat2 } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { usePanel } from "@/hooks/usePanel";
import PanelUserDrawer from "./PanelUserDrawer";
import useProfile from "@/hooks/useProfile";
import { PanelUser } from "@/types/panelUser";

const UserProfileModal = ({ onClose }: { onClose: () => void }) => {
  const {
    user,
    currentRole,
    roleOptions,
    canSwitchRole,
    handleSwitchRole,
    handleLogout,
  } = usePanel(onClose);
  const { isDrawerOpen, drawerMode, selectedUser, closeDrawer, openDrawer } =
    useProfile();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close profile menu"
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div className="fixed top-15 right-3 z-50 flex min-w-44 flex-col gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2"
          onClick={() => openDrawer(user as PanelUser, "view")}
        >
          <CircleUser size={14} />
          <span className="text-sm text-slate-500">Profile</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2"
        >
          <LogOut size={14} />
          <span className="text-sm text-slate-500">Logout</span>
        </button>
        {canSwitchRole ? (
          <div className="flex items-center gap-2">
            <Repeat2 size={14} />
            <select
              name="role"
              id="role"
              className="bg-transparent text-sm text-slate-500 focus:outline-none"
              value={currentRole}
              onChange={handleSwitchRole}
            >
              {roleOptions.map(({ label, value }) => (
                <option
                  key={value}
                  value={value}
                  disabled={value === currentRole}
                  className="cursor-pointer text-sm text-slate-500"
                >
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <PanelUserDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        user={selectedUser}
        onClose={closeDrawer}
      />
    </>,
    document.body,
  );
};

export default UserProfileModal;
