// currentUserSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserResponseDto } from "../../api/user/user.type";

interface Route {
  route: string;
}

const initialState: Route = {
  route: "",
};

const currentRoute = createSlice({
  name: "route",
  initialState,
  reducers: {
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.route = action.payload;
    },
  },
});

export const { setCurrentRoute } = currentRoute.actions;

export default currentRoute.reducer;
