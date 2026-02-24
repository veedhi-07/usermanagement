import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface ModulePermission {
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

export interface PermissionsState {
  campaign?: ModulePermission;
  chat?: ModulePermission;
  user?: ModulePermission;
  role?: ModulePermission;
}

export type ModuleKey = keyof PermissionsState;
export type ActionKey = keyof ModulePermission;

const initialState: PermissionsState = {}; 

const permissionSlice = createSlice({
  name: "permissions",
  initialState, 
  reducers: {
    setPermissions: (
      state,
      action: PayloadAction<PermissionsState>
    ) => {
      return action.payload;
    },
    clearPermissions: () => {
      return {};
    },
  },
});

export const { setPermissions, clearPermissions } =
  permissionSlice.actions;

export default permissionSlice.reducer;