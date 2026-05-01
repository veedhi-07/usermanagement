import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../features/users/types";
import { Role } from "../../../features/roles/types";

interface Permission {
  module: string;
  action: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  role: Role | null;
  permissions: Permission[];
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  role: null,
  permissions: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.permissions = [];
      localStorage.removeItem("token");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
