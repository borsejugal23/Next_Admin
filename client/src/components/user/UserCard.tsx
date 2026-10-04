import type { User } from "@/types/user";
import { UserDetailTab } from "@/types/user";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Building2 } from "lucide-react";
import Link from "next/link";

const ROLE_STYLES = {
  admin: "text-red-700",
  moderator: "text-yellow-700",
  user: "text-blue-700",
} as const;

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="w-full shadow-xl rounded-md p-3">
      <Link href={`/user/${user._id}/${UserDetailTab.ABOUT}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={user?.image}
              alt={user?.firstName ?? "User"}
              width={100}
              height={100}
              sizes=""
              className="w-10 h-10 object-cover rounded-full"
            />
            <p className="font-medium text-md ">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <span
            className={`text-xs font-medium ${
              ROLE_STYLES[user.role as keyof typeof ROLE_STYLES]
            }`}
          >
            {user.role}
          </span>
        </div>
        <div className="text-gray-500 text-sm mt-4">
          <p className="flex items-center gap-2 truncate">
            <Mail size={15} color="#7777E7" />
            {user.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={15} color="#7777E7" />
            {user.phone}
          </p>
          {/* <p>Role - {user.role}</p> */}
          <p className="flex items-center gap-2">
            <Building2 size={15} color="#7777E7" />
            {user.company?.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
