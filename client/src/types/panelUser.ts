import type { PanelUserRole } from "@/lib/roles";

export interface PanelUser {
  _id: string;
  name: string;
  email: string;
  role: PanelUserRole;
  allowedRoles: PanelUserRole[];
  flags?: {
    isActive?: boolean;
    isDeleted?: boolean;
  };
}
