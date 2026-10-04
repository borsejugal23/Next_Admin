import { panelUserKeys } from "@/lib/query-keys";
import { signOutPanelUser } from "@/services/authApi";
import {
  deletePanelUser,
  getPanelUsers,
  updatePanelUser,
} from "@/services/panelUserApi";
import {
  clearPanelUserProfile,
  setUserProfile,
  switchUserRole,
} from "@/stores/panelUser/reducer";
import {
  selectPanelUser,
  selectPanelUserAllowedRoles,
  selectPanelUserRole,
} from "@/stores/panelUser/selector";
import { getRoleOptions } from "@/lib/roles";
import { UserDetailTab } from "@/types/user";
import type { PanelUser } from "@/types/panelUser";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const usePanel = (onClose: () => void) => {
  const dispatch = useDispatch();
  const { mutate: updatePanelUser } = useUpdatePanelUser();
  const user = useSelector(selectPanelUser);

  const router = useRouter();
  const pathname = usePathname();
  const currentRole = useSelector(selectPanelUserRole);
  const allowedRoles = useSelector(selectPanelUserAllowedRoles);
  const roleOptions = getRoleOptions(allowedRoles, currentRole);
  const canSwitchRole = roleOptions.length > 1;

  const handleSwitchRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextRole = e.target.value;
    if (!roleOptions.some((option) => option.value === nextRole)) return;

    dispatch(switchUserRole(nextRole));

    const userDetailMatch = pathname.match(/^\/user\/([^/]+)\/[^/]+$/);
    if (userDetailMatch) {
      const [, userId] = userDetailMatch;
      router.replace(`/user/${userId}/${UserDetailTab.ABOUT}`);
    }

    onClose();

    if (!user?._id) {
      toast.error("Missing user id. Please sign in again.");
      return;
    }

    updatePanelUser({ id: user._id, data: { role: nextRole } });
  };

  const handleLogout = () => {
    signOutPanelUser();
    onClose();
    dispatch(clearPanelUserProfile());
    router.push("/sign-in");
  };

  return {
    user,
    currentRole,
    roleOptions,
    canSwitchRole,
    handleSwitchRole,
    handleLogout,
  };
};

export const usepanelUsers = () =>
  useQuery({
    queryKey: panelUserKeys.lists(),
    queryFn: () => getPanelUsers(),
    placeholderData: keepPreviousData,
  });

export const useUpdatePanelUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectPanelUser);

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePanelUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<PanelUser[]>(panelUserKeys.lists(), (current) =>
        current?.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );

      if (currentUser._id && currentUser._id === updatedUser._id) {
        dispatch(
          setUserProfile({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            allowedRoles: updatedUser.allowedRoles,
          }),
        );
      }

      toast.success("Panel user updated successfully");
    },
  });
};

export const useDeletePanelUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePanelUser(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<PanelUser[]>(panelUserKeys.lists(), (current) =>
        current?.filter((user) => user._id !== id),
      );
      toast.success("Panel user deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
