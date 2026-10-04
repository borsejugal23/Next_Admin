import type { User } from "@/types/user";
import {
  Droplets,
  GraduationCap,
  Ruler,
  Shield,
  ShieldCheck,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

type ProfileDetail = {
  title: string;
  value: string | number | undefined;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  border: string;
};

const UserProfileIdentity = ({ user }: { user: User | null }) => {
  const profileDetails = useMemo(() => {
    return [
      {
        title: "Age",
        value: user?.age,
        icon: Shield,
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
        border: "border-l-2 border-l-blue-600",
      },
      {
        title: "Blood Group",
        value: user?.bloodGroup,
        icon: Droplets,
        bgColor: "bg-red-100",
        iconColor: "text-red-600",
        border: "border-l-2 border-l-red-600",
      },
      user?.university && {
        title: "University",
        value: user?.university,
        icon: GraduationCap,
        bgColor: "bg-purple-100",
        iconColor: "text-purple-600",
        border: "border-l-2 border-l-purple-600",
      },
      {
        title: "Role",
        value: user?.role,
        icon: ShieldCheck,
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
        border: "border-l-2 border-l-green-600",
      },
      {
        title: "Gender",
        value: user?.gender,
        icon: UserIcon,
        bgColor: "bg-pink-100",
        iconColor: "text-pink-600",
        border: "border-l-2 border-l-pink-600",
      },
      {
        title: "Height",
        value: user?.height,
        icon: Ruler,
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
        border: "border-l-2 border-l-orange-600",
      },
    ].filter(Boolean) as ProfileDetail[];
  }, [user]);

  return (
    <div className="grid w-full grid-cols-2 md:grid-cols-3 gap-4 py-2 ">
      {profileDetails.map((detail) => (
        <div
          key={detail.title}
          className={`flex w-full items-center gap-3 rounded-lg border border-gray-300 p-3 ${detail.border}`}
        >
          <div
            className={`flex items-center justify-center rounded-xl p-2 ${detail.bgColor}`}
          >
            <detail.icon className={`h-5 w-5 ${detail.iconColor}`} />
          </div>
          <div className="flex flex-col">
            <p
              className="max-w-22.5 truncate text-sm font-medium"
              title={
                detail.title === "University"
                  ? (detail.value as string)
                  : undefined
              }
            >
              {detail.value}
            </p>
            <p className="text-xs text-gray-500">{detail.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfileIdentity;
