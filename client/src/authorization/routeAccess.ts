import canAccess from "./canAccess";

export type RouteAccessRule = {
  path: string;
  permission: string;
};

export const routeAccess: RouteAccessRule[] = [
  {
    path: "/product",
    permission: "product:view",
  },
  {
    path: "/user",
    permission: "user:view",
  },
  {
    path: "/useranalysis",
    permission: "useranalysis:view",
  },
  {
    path: "/paneluser",
    permission: "paneluser:view",
  },
];

export function getRoutePermission(pathname: string): string | null {
  const match = [...routeAccess]
    .sort((a, b) => b.path.length - a.path.length)
    .find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));

  return match?.permission ?? null;
}

export function canAccessRoute(role: string, pathname: string): boolean {
  const permission = getRoutePermission(pathname);
  if (!permission) return true;

  return canAccess(role, permission);
}

export function getFirstAccessibleRoute(role: string): string | null {
  for (const { path, permission } of routeAccess) {
    if (canAccess(role, permission)) {
      return path;
    }
  }

  return null;
}
