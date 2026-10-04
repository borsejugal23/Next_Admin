"use client";

import { PanelUser } from "@/types/panelUser";
import { Eye, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import PanelUserDrawer from "@/components/panelUser/PanelUserDrawer";
import useProfile from "@/hooks/useProfile";

const PanelUserPage = () => {
  const {
    panelUsers,
    canDelete,
    canEdit,
    isDrawerOpen,
    drawerMode,
    selectedUser,
    tableHeaders,
    openDrawer,
    closeDrawer,
    deletePanelUser,
  } = useProfile();

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-5 lg:p-6">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-700">
            <ShieldCheck className="size-3.5" aria-hidden />
            Access management
          </div>

          <h1 className="text-xl font-semibold tracking-tight text-slate-950">
            Panel users
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Review account status, roles, and permissions.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <Plus className="size-3.5" aria-hidden />
          Add panel user
        </button>
      </header>

      <hr className="border-slate-200" />

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="panel-user-list-title"
            className="text-base font-semibold text-slate-900"
          >
            All panel users
          </h2>

          <span className="text-xs text-slate-400">
            {panelUsers?.length} {panelUsers?.length === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-225 border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    className="whitespace-nowrap p-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {panelUsers?.map((panelUser: PanelUser) => (
                <tr
                  key={panelUser._id}
                  className="border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/70"
                >
                  {/* Name */}
                  <td className="whitespace-nowrap px-3 text-sm font-medium text-slate-900">
                    {panelUser.name}
                  </td>

                  {/* Email */}
                  <td className="text-xs text-slate-500">{panelUser.email}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full text-[11px] font-medium ${
                        panelUser.flags?.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          panelUser.flags?.isActive
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      {panelUser.flags?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="whitespace-nowrap text-xs font-medium text-slate-700">
                    {panelUser.role}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* VIEW */}
                      <button
                        type="button"
                        title={`View ${panelUser.name}`}
                        aria-label={`View ${panelUser.name}`}
                        onClick={() => openDrawer(panelUser, "view")}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye className="size-4 text-blue-500" />
                      </button>

                      {canEdit && (
                        <button
                          type="button"
                          title={`Edit ${panelUser.name}`}
                          aria-label={`Edit ${panelUser.name}`}
                          onClick={() => openDrawer(panelUser, "edit")}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Pencil className="size-4 text-blue-500" />
                        </button>
                      )}

                      {/* DELETE */}
                      {canDelete && (
                        <button
                          type="button"
                          title={`Delete ${panelUser.name}`}
                          aria-label={`Delete ${panelUser.name}`}
                          onClick={() => deletePanelUser(panelUser._id)}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SINGLE DYNAMIC DRAWER */}
      <PanelUserDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        user={selectedUser}
        onClose={closeDrawer}
      />
    </main>
  );
};

export default PanelUserPage;
