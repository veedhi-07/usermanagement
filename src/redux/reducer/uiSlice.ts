import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { conversation, Message, User } from "../../types";
import type { RootState, AppDispatch } from "./../store";
type SortOrder = "asc" | "desc";

interface UsersUIState {
  searchQuery: string;
  sortOrder: SortOrder;
  selectedUser: User | null;
  showModals: {
    add: boolean;
    delete: boolean;
  };
}

interface RolesUIState {
  searchQuery: string;
  sortOrder: SortOrder;
  showDeleteModal: boolean;
}
interface ChatsUIState {
  selectedUserC: User | null;
  spaceName: string | null;
  isGroupChat: boolean;
  showSpaceModal: boolean;
  ShowDirectChatModal: boolean;
  loadingChats: boolean;
  loadingUsers: boolean;
}
interface UIState {
  users: UsersUIState;
  roles: RolesUIState;
  chats: ChatsUIState;
  sidebarOpen: boolean;
  loading: boolean;
}

const initialState: UIState = {
  sidebarOpen: false,
  loading: true,
  users: {
    searchQuery: "",
    sortOrder: "asc" as SortOrder,
    selectedUser: null,
    showModals: { add: false, delete: false },
  },
  roles: {
    searchQuery: "",
    sortOrder: "asc" as SortOrder,
    showDeleteModal: false,
  },
  chats: {
    selectedUserC: null,
    spaceName: null,
    isGroupChat: false,
    showSpaceModal: false,
    ShowDirectChatModal: false,
    loadingChats: true,
    loadingUsers: true,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserSearch: (state, action: PayloadAction<string>) => {
      state.users.searchQuery = action.payload;
    },

    setUserSort: (state, action: PayloadAction<SortOrder>) => {
      state.users.sortOrder = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.users.selectedUser = action.payload;
    },

    setShowModals: (
      state,
      action: PayloadAction<{
        add: boolean;
        delete: boolean;
      }>,
    ) => {
      state.users.showModals = action.payload;
    },
    // Roles
    setRoleSearch: (state, action: PayloadAction<string>) => {
      state.roles.searchQuery = action.payload;
    },
    setRoleSort: (state, action: PayloadAction<SortOrder>) => {
      state.roles.sortOrder = action.payload;
    },
    setShowDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.roles.showDeleteModal = action.payload;
    },
    // Chats
    // setSelectedUserC: (state, action: PayloadAction<User | null>) => {
    //   state.users.selectedUserC = action.payload;
    // },
    setSpaceName: (state, action: PayloadAction<string | null>) => {
      state.chats.spaceName = action.payload;
    },
    setIsGroupChat: (state, action: PayloadAction<boolean>) => {
      state.chats.isGroupChat = action.payload;
    },
    setShowSpaceModal: (state, action: PayloadAction<boolean>) => {
      state.chats.showSpaceModal = action.payload;
    },
    setShowDirectChatModal: (state, action: PayloadAction<boolean>) => {
      state.chats.ShowDirectChatModal = action.payload;
    },
    setLoadingChats: (state, action: PayloadAction<boolean>) => {
      state.chats.loadingChats = action.payload;
    },
    setLoadingUsers: (state, action: PayloadAction<boolean>) => {
      state.chats.loadingUsers = action.payload;
    },
  },
});

export const {
  setUserSearch,
  setUserSort,
  setLoading,
  setSelectedUser,
  setShowModals,
  setRoleSearch,
  setRoleSort,
  setShowDeleteModal,
  setSidebarOpen,
  setSpaceName,
  setIsGroupChat,
  setShowSpaceModal,
  setShowDirectChatModal,
  setLoadingChats,
  setLoadingUsers,
} = uiSlice.actions;
export default uiSlice.reducer;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
