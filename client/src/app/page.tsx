import { getFirstAccessibleRoute } from "@/authorization/routeAccess";
import { getVerifiedAccessToken } from "@/lib/verify-access-token";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  const tokenPayload = accessToken
    ? await getVerifiedAccessToken(accessToken)
    : null;

  if (!tokenPayload) {
    redirect("/sign-in");
  }

  const fallbackRoute =
    (tokenPayload.role && getFirstAccessibleRoute(tokenPayload.role)) ||
    "/product";

  redirect(fallbackRoute);
}
