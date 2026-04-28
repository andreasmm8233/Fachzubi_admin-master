// authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EmployeePermissions } from "@/app/api/manageEmployee/helper";

interface AuthState {
  isLogin: boolean;
  loading: boolean;
  role: "admin" | "employee" | null;
  permissions: EmployeePermissions | null;
}

const initialState: AuthState = {
  isLogin: false,
  loading: true,
  role: null,
  permissions: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRole: (state, action: PayloadAction<"admin" | "employee" | null>) => {
      state.role = action.payload;
    },
    setPermissions: (
      state,
      action: PayloadAction<EmployeePermissions | null>
    ) => {
      state.permissions = action.payload;
    },
  },
});

export const { setIsLogin, setIsLoading, setRole, setPermissions } =
  authSlice.actions;

export default authSlice.reducer;
