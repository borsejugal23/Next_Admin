import AppShell from "@/components/AppShell";
import { verifyAccessToken } from "@/lib/verify-access-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = (await cookies()).get("accessToken")?.value;
  const isAuthenticated = accessToken
    ? await verifyAccessToken(accessToken)
    : false;

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  return <AppShell>{children}</AppShell>;
}
