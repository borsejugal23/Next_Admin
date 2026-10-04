import { DEFAULT_USER_DETAIL_TAB } from "@/lib/user-tabs";
import { redirect } from "next/navigation";

type UserDetailIndexPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailIndexPage({
  params,
}: UserDetailIndexPageProps) {
  const { id } = await params;
  redirect(`/user/${id}/${DEFAULT_USER_DETAIL_TAB}`);
}
