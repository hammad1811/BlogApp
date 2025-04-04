import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  accessToken: null,
  refreshToken: null,
  isActive: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userData = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isActive = true;
    },
    logout: (state) => {
      state.userData = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isActive = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
