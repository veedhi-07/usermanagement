import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "./reducer/permissionSlice";
import profileReducer from "./reducer/profileSlice"
export const store = configureStore({
  reducer: {
    permissions: permissionReducer,
    profile: profileReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;