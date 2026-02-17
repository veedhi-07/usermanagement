import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
export interface ProfileState {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

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
