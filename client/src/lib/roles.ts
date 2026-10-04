export const ROLES = ["admin", "moderator", "panel_user"] as const;

export type PanelUserRole = (typeof ROLES)[number];

export const ROLE_LABELS: Record<PanelUserRole, string> = {
  admin: "Admin",
  moderator: "Moderator",
  panel_user: "Panel User",
};

export function formatRoleLabel(role: string): string {
  if (role in ROLE_LABELS) {
    return ROLE_LABELS[role as PanelUserRole];
  }

  return role
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export type RoleOption = {
  value: string;
  label: string;
};

/** Build select options from BE allowedRoles, always including currentRole. */
export function getRoleOptions(
  allowedRoles?: readonly string[] | null,
  currentRole?: string | null,
): RoleOption[] {
  const roles = new Set<string>();

  for (const role of allowedRoles ?? []) {
    if (typeof role === "string" && role.trim()) {
      roles.add(role.trim());
    }
  }

  if (typeof currentRole === "string" && currentRole.trim()) {
    roles.add(currentRole.trim());
  }

  return Array.from(roles).map((role) => ({
    value: role,
    label: formatRoleLabel(role),
  }));
}
