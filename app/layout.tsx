// RootLayout.tsx
"use client";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import ThemeCustomization from "@/themes";
import LocalStorageEvent from "./localStorageEvent";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>fachzubi</title>
      </head>
      <Provider store={store}>
        <ThemeCustomization>
          <body suppressHydrationWarning={true}>
            <LocalStorageEvent />
            {children}
          </body>
        </ThemeCustomization>
      </Provider>
    </html>
  );
}
