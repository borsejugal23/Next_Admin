"use client";

import { useEffect, useState } from "react";
import { PanelUser } from "@/types/panelUser";
import { X } from "lucide-react";
import { useUpdatePanelUser } from "@/hooks/usePanel";

type DrawerMode = "view" | "edit";

type PanelUserDrawerProps = {
  isOpen: boolean;
  mode: DrawerMode;
  user: PanelUser | null;
  onClose: () => void;
};

const PanelUserDrawer = ({
  isOpen,
  mode,
  user,
  onClose,
}: PanelUserDrawerProps) => {
  const { mutate: updatePanelUser } = useUpdatePanelUser();
  const [formData, setFormData] = useState<PanelUser | null>(user);

  // Whenever selected user changes, update drawer data
  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleChange = (field: keyof PanelUser, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = () => {
    updatePanelUser({ id: formData._id, data: formData });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {mode === "view" ? "Panel user details" : "Edit panel user"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {mode === "view"
                ? "View account information and permissions."
                : "Update account information and permissions."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close drawer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Name */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Name
            </label>

            {mode === "view" ? (
              <p className="text-sm text-slate-900">{formData.name}</p>
            ) : (
              <input
                type="text"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Email
            </label>

            {mode === "view" ? (
              <p className="text-sm text-slate-900">{formData.email}</p>
            ) : (
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            )}
          </div>

          {/* Status */}
          {formData.flags?.isActive && (
            <div className="mb-5">
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Status
              </label>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  formData.flags?.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    formData.flags?.isActive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />

                {formData.flags?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          )}

          {/* Role */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Role
            </label>

            {mode === "view" ? (
              <p className="text-sm font-medium text-slate-900">
                {formData.role}
              </p>
            ) : (
              <select
                value={formData.role}
                onChange={(event) => handleChange("role", event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="panel_user">Panel User</option>
              </select>
            )}
          </div>

          {/* Allowed Roles */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-medium text-slate-700">
              Allowed roles
            </label>

            <div className="space-y-2">
              {["admin", "moderator", "panel_user"].map((role) => {
                const checked =
                  formData.allowedRoles?.includes(role as any) ?? false;

                return (
                  <label
                    key={role}
                    className={`flex items-center gap-2 text-sm text-slate-700 ${
                      mode === "view" ? "pointer-events-none" : "cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      tabIndex={mode === "view" ? -1 : undefined}
                      aria-disabled={mode === "view"}
                      onChange={(event) => {
                        if (mode === "view") return;

                        setFormData((prev) => {
                          if (!prev) return prev;

                          const currentRoles = prev.allowedRoles ?? [];

                          const updatedRoles = event.target.checked
                            ? [...currentRoles, role]
                            : currentRoles.filter((item) => item !== role);

                          return {
                            ...prev,
                            allowedRoles:
                              updatedRoles as PanelUser["allowedRoles"],
                          };
                        });
                      }}
                      className="size-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
                    />

                    <span className="capitalize">{role.replace("_", " ")}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        {mode === "edit" && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default PanelUserDrawer;
