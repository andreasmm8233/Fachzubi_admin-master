import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import authReducer from "./auth/authSlice";
import currentReducer from "./protectRoute/previousRouteSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    currentRoute: currentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
