import type { PanelUserRole } from "@/lib/roles";

export type SignInBody = {
  email: string;
  password: string;
};

export type SignUpBody = {
  name: string;
  email: string;
  password: string;
  otp: string;
};

export type AuthUser = {
  _id: string;
  email: string;
  name: string;
  role: PanelUserRole | string;
  allowedRoles?: PanelUserRole[] | string[];
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
};
