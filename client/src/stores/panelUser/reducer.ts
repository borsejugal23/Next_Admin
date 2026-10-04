import { AuthUser } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PanelUserState = {
  _id: string;
  name: string;
  email: string;
  role: string;
  allowedRoles: string[];
};

const initialState: PanelUserState = {
  _id: "",
  name: "",
  email: "",
  role: "",
  allowedRoles: [],
};

export const userProfileSlice = createSlice({
  name: "panelUser",
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<AuthUser>) {
      const { _id, name, email, role, allowedRoles } = action.payload;
      state._id = _id ?? "";
      state.name = name;
      state.email = email;
      state.role = role ?? "";
      state.allowedRoles = Array.isArray(allowedRoles)
        ? allowedRoles.filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0,
          )
        : [];
    },
    switchUserRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },

    clearPanelUserProfile(state) {
      state._id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.allowedRoles = [];
    },
  },
});

export const { setUserProfile, switchUserRole, clearPanelUserProfile } =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
