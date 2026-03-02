import { configureStore, combineReducers } from "@reduxjs/toolkit";
import permissionReducer from "./reducer/permissionSlice";
import profileReducer from "./reducer/profileSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  profile: profileReducer,
  permission: permissionReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["profile"], // only persist profile
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>; //Take whatever store.getState() returns and make that a type.
export type AppDispatch = typeof store.dispatch;
