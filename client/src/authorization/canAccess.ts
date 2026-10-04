import rolePermission from "./permission";

export default function canAccess(role: string, action: string) {
  const permissions = rolePermission[role as keyof typeof rolePermission];
  if (!permissions) return false;

  return permissions.includes(action);
}
