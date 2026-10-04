import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import UserListClient from "./UserListClient";

function UserPageFallback() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full items-center justify-center bg-white">
      <LoaderCircle className="animate-spin" size={40} color="#7777E7" />
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={<UserPageFallback />}>
      <UserListClient />
    </Suspense>
  );
}
