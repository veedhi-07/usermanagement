
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { PermissionsState } from "../../../types";

const normalizePermissions = (permissionsArray: any[]): PermissionsState => {
  const result: PermissionsState = {};

  permissionsArray.forEach((p) => {
    result[p.moduleSlug] = {
      moduleSlug: p.moduleSlug,
      list: p.list,
      view: p.view,
      add: p.add,
      edit: p.edit,
      delete: p.delete,
    };
  });

  return result;
};

const initialState: PermissionsState = {};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<any[]>) => {
      console.log("RAW PERMISSIONS:", action.payload);
      const normalized = normalizePermissions(action.payload);

      console.log("NORMALIZED:", normalized);
      return normalized;
    },

    clearPermissions: () => ({}),
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
