// currentUserSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUserResponseDto } from "../../api/user/user.type";

interface CurrentUserState {
  data: CurrentUserResponseDto | null;
}

const initialState: CurrentUserState = {
  data: null,
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      action: PayloadAction<CurrentUserResponseDto | null>
    ) => {
      state.data = action.payload;
    },
  },
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
