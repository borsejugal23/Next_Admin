"use client";

import FilterMenu from "@/components/FilterMenu";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/SearchBar";
import UserCard from "@/components/user/UserCard";
import { useUserList } from "@/hooks/useUserList";
import { USER_FILTER_OPTIONS } from "@/lib/user-filters";
import type { User } from "@/types/user";
import { LoaderCircle } from "lucide-react";

export default function UserListClient() {
  const {
    page,
    search,
    users,
    total,
    isLoading,
    limit,
    showingFrom,
    showingTo,
    getFilterMenuProps,
    handleSearch,
    handlePageChange,
  } = useUserList();

  return (
    <div className="w-full bg-white p-4">
      <div className="flex items-center gap-16">
        <p className="font-medium text-lg text-gray-900">Users</p>
        <SearchBar value={search} onSearch={handleSearch} />
      </div>
      <div className="flex items-center gap-4 py-2">
        <p className="text-sm font-medium text-gray-500">Filter by</p>
        <FilterMenu
          {...getFilterMenuProps("Role")}
          filterOptions={USER_FILTER_OPTIONS.Role}
        />
        <FilterMenu
          {...getFilterMenuProps("Gender")}
          filterOptions={USER_FILTER_OPTIONS.Gender}
        />
      </div>
      <div className="relative py-4">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <LoaderCircle className="animate-spin" size={40} color="#7777E7" />
          </div>
        )}
        <div className="grid w-full grid-cols-1 gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
          {users.length > 0 ? (
            users.map((user: User) => <UserCard key={user.id} user={user} />)
          ) : !isLoading ? (
            <div className="col-span-full flex min-h-[calc(100vh-12rem)] items-center justify-center">
              <p className="font-medium text-lg text-gray-900">
                No users found
              </p>
            </div>
          ) : (
            <div className="col-span-full min-h-[calc(100vh-12rem)]" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 bg-white">
        <p className="text-sm font-medium text-gray-500">
          Showing {showingFrom} to {showingTo} of {total} users
        </p>
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
