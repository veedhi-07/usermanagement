import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState } from "../../types";

const initialState: ProfileState = {
  uid: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (_, action: PayloadAction<ProfileState>) => {
      return action.payload;
    },

    clearProfile: () => initialState,
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
