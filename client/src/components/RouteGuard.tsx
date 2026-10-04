"use client";

import {
  canAccessRoute,
  getFirstAccessibleRoute,
} from "@/authorization/routeAccess";
import { selectPanelUserRole } from "@/stores/panelUser/selector";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useSelector(selectPanelUserRole);

  useEffect(() => {
    if (!role) return;

    if (canAccessRoute(role, pathname)) return;

    const fallbackRoute = getFirstAccessibleRoute(role);
    router.replace(fallbackRoute ?? "/sign-in");
  }, [pathname, role, router]);

  return <>{children}</>;
}
