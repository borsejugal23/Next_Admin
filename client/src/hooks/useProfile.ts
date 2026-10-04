import { useState } from "react";
import { useDeletePanelUser, usepanelUsers } from "@/hooks/usePanel";
import { PanelUser } from "@/types/panelUser";

// import canAccess from "@/authorization/canAccess";
import useCan from "@/authorization/useCan";
type DrawerMode = "view" | "edit";

const useProfile = () => {
  const { data: panelUsers, isLoading, error } = usepanelUsers();
  const { mutate: deletePanelUser } = useDeletePanelUser();
  const canDelete = useCan("paneluser:delete");
  const canEdit = useCan("paneluser:update");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [selectedUser, setSelectedUser] = useState<PanelUser | null>(null);
  const tableHeaders = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Email",
      key: "email",
    },
    {
      label: "Status",
      key: "status",
    },
    {
      label: "Role",
      key: "role",
    },
    {
      label: "Actions",
      key: "actions",
    },
  ];
  const openDrawer = (user: PanelUser, mode: DrawerMode) => {
    setSelectedUser(user);
    setDrawerMode(mode);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };
  return {
    isDrawerOpen,
    drawerMode,
    selectedUser,
    canDelete,
    canEdit,
    isLoading,
    error,
    panelUsers,
    tableHeaders,
    deletePanelUser,
    openDrawer,
    closeDrawer,
  };
};
export default useProfile;
