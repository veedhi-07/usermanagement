// redux/reducer/auth-slice/index.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  role: string | null;
}

const initialState: AuthState = {
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = authSlice.actions;
export default authSlice.reducer;
