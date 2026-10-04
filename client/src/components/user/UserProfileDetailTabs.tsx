import { UserDetailTab } from "@/types/user";
import {
  Banknote,
  Briefcase,
  MonitorCloud,
  ShieldCheck,
  ShoppingCart,
  User,
  UserStar,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import useCan from "@/authorization/useCan";

type Tab = {
  label: string;
  value: UserDetailTab;
  icon: LucideIcon;
};

let tabs: Tab[] = [
  { label: "About", value: UserDetailTab.ABOUT, icon: User },
  { label: "Work & Life", value: UserDetailTab.WORK_AND_LIFE, icon: Briefcase },
  { label: "Financial", value: UserDetailTab.FINANCIAL, icon: Banknote },
  { label: "Security", value: UserDetailTab.SECURITY, icon: ShieldCheck },
  { label: "Services", value: UserDetailTab.SERVICES, icon: MonitorCloud },
  { label: "Review", value: UserDetailTab.REVIEW, icon: UserStar },
  { label: "Cart", value: UserDetailTab.CART, icon: ShoppingCart },
];

const UserProfileDetailTabs = ({
  userId,
  activeTab,
}: {
  userId: string;
  activeTab: UserDetailTab;
}) => {
  const canAccessFinancial = useCan("financial:view");
  const visibleTabs = tabs.filter((tab) => {
    if (tab.value === UserDetailTab.FINANCIAL) {
      return canAccessFinancial;
    }

    return true;
  });
  return (
    <div>
      <div className="flex items-center gap-10 overflow-x-auto pl-6 border-b border-gray-200">
        {visibleTabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/user/${userId}/${tab.value}`}
            className={`flex items-center gap-4 p-4 text-sm font-semibold whitespace-nowrap ${
              activeTab === tab.value
                ? "border-b-2 border-[#7950F2] text-[#7950F2]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon size={22} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserProfileDetailTabs;
