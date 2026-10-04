"use client";

import canAccess from "@/authorization/canAccess";
import { routeAccess } from "@/authorization/routeAccess";
import { selectPanelUserRole } from "@/stores/panelUser/selector";
import {
  FileChartColumn,
  Package,
  User,
  type LucideIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const navItems: {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: "/product", label: "Product", Icon: Package },
  { href: "/user", label: "User", Icon: Users },
  {
    href: "/productanalysis",
    label: "Product Analysis",
    Icon: FileChartColumn,
  },
  { href: "/useranalysis", label: "User Analysis", Icon: FileChartColumn },
  { href: "/paneluser", label: "Panel User", Icon: User },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const role = useSelector(selectPanelUserRole);

  const visibleNavItems = navItems.filter(({ href }) => {
    const rule = routeAccess.find(({ path }) => path === href);
    if (!rule) return true;

    return role ? canAccess(role, rule.permission) : false;
  });

  return (
    <aside
      className={`fixed top-14 bottom-0 left-0 z-30 flex w-42 shrink-0 flex-col overflow-hidden bg-gray-100 shadow-xl transition-transform duration-300 ease-in-out md:relative md:top-auto md:bottom-auto md:z-auto md:shadow-none md:transition-[width] ${
        isOpen
          ? "translate-x-0 md:w-42"
          : "-translate-x-full md:w-0 md:translate-x-0"
      }`}
    >
      <nav className="flex flex-col gap-1 p-3">
        {visibleNavItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={`rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon className="size-5 shrink-0" aria-hidden />
                <span
                  className={`truncate whitespace-nowrap transition-[opacity,max-width] duration-300 ease-in-out ${
                    isOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
                  }`}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
