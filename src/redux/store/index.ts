import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducer/auth-slice";
import permissionReducer from "../reducer/permission-slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    permission: permissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

