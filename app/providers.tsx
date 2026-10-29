"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import ThemeCustomization from "@/themes";
import LocalStorageEvent from "./localStorageEvent";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeCustomization>
        <LocalStorageEvent />
        {children}
      </ThemeCustomization>
    </Provider>
  );
}
