"use client";

import UserProfileIdentity from "@/components/user/UserProfileIdentity";
import UserProfileDetailTabs from "@/components/user/UserProfileDetailTabs";
import UserTabPanel from "@/components/user/UserTabPanel";
import { useUser } from "@/hooks/useUsers";
import { getUsersListPage } from "@/lib/users-pagination";
import { isUserDetailTab } from "@/lib/user-tabs";
import { UserDetailTab } from "@/types/user";
import {
  ArrowLeft,
  LoaderCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserDetailClient() {
  const router = useRouter();
  const { id, tab } = useParams<{ id: string; tab: string }>();
  const backPage = getUsersListPage();
  const activeTab = isUserDetailTab(tab) ? tab : UserDetailTab.ABOUT;

  const { data: user, isLoading } = useUser(id);

  useEffect(() => {
    if (!isUserDetailTab(tab)) {
      router.replace(`/user/${id}/${UserDetailTab.ABOUT}`);
    }
  }, [id, tab, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] w-full items-center justify-center">
        <LoaderCircle className="animate-spin" size={40} color="#7777E7" />
      </div>
    );
  }

  return (
    <main className="p-2">
      <header className="flex flex-col rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/user?page=${backPage}`}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Users
          </Link>

          <button className="flex items-center gap-2 bg-[#7950F2] text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-[#695BEB] cursor-pointer">
            <Pencil size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 items-center justify-between gap-6 lg:grid-cols-2">
          <div className="mt-4 flex flex-col gap-6 rounded-3xl lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-3 md:gap-6">
              {user && (
                <div className="relative aspect-square h-24 w-24 md:h-36 md:w-36 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm">
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    sizes="128px"
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              <section className="flex flex-col md:justify-center gap-2">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-lg font-bold text-gray-900 md:text-xl">
                    {user?.firstName} {user?.lastName}
                  </h1>

                  <span className="rounded-md bg-[#F1EEFF] px-2 py-1 text-xs font-medium capitalize text-[#695BEB] md:text-sm hidden md:block">
                    {user?.role}
                  </span>
                </div>

                <div className="flex flex-col">
                  {user?.company?.title && (
                    <p className="text-xs font-medium text-[#6256EA] md:text-sm">
                      {user.company.title}
                    </p>
                  )}

                  {user?.company?.name && (
                    <p className="text-sm text-gray-500">{user.company.name}</p>
                  )}
                </div>

                <div className="text-xs text-gray-600 md:text-[13px] hidden md:block">
                  {user?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  )}

                  {user?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {user.address.address}, {user.address.city},{" "}
                        {user.address.state}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <UserProfileIdentity user={user ?? null} />
        </div>
      </header>

      <section className="mt-4 overflow-hidden rounded-xl border border-gray-200">
        <UserProfileDetailTabs userId={id} activeTab={activeTab} />
        <UserTabPanel user={user ?? null} activeTab={activeTab} />
      </section>
    </main>
  );
}
