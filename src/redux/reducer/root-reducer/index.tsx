import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../auth-slice";
import permissionReducer from "../permission-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  permission: permissionReducer,
});

export default rootReducer;
