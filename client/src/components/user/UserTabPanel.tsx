"use client";

import dynamic from "next/dynamic";
import { getUserTabBlocks } from "@/metaData/user/userInfo";
import { useUserCart } from "@/hooks/useUsers";
import type { User, UserDetailTab } from "@/types/user";
import { UserDetailTab as Tabs } from "@/types/user";
import InfoBlock from "./InfoBlock";

const UserCartPanel = dynamic(() => import("./UserCartPanel"), {
  loading: () => <p>Loading chart...</p>,
});
const UserReview = dynamic(() => import("./UserReview"), {
  loading: () => <p>Loading review...</p>,
});

type UserTabPanelProps = {
  user: User | null;
  activeTab: UserDetailTab;
};

const UserTabPanel = ({ user, activeTab }: UserTabPanelProps) => {
  const { data: cart, isLoading: isCartLoading } = useUserCart(
    activeTab === Tabs.CART ? user?.id : undefined,
  );

  if (!user) {
    return (
      <div className="flex min-h-48 items-center justify-center p-6 text-sm text-gray-500">
        Loading user details...
      </div>
    );
  }

  if (activeTab === Tabs.REVIEW) {
    return <UserReview email={user.email} />;
  }

  if (activeTab === Tabs.CART) {
    return <UserCartPanel cart={cart} isLoading={isCartLoading} />;
  }

  const blocks = getUserTabBlocks(
    user,
    activeTab as Exclude<UserDetailTab, typeof Tabs.REVIEW | typeof Tabs.CART>,
  );

  if (blocks.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center p-6 text-sm text-gray-500">
        No details available for this tab.
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 p-4 md:columns-2 xl:columns-3">
      {blocks.map((block) => (
        <div key={block.title} className="mb-4 break-inside-avoid">
          <InfoBlock {...block} />
        </div>
      ))}
    </div>
  );
};

export default UserTabPanel;
