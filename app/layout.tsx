// RootLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
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
  const [title, setTitle] = useState("fachzubi");

  useEffect(() => {
    const hideLogoDomain = process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN;
    if (typeof window !== "undefined" && hideLogoDomain) {
      if (window.location.hostname === hideLogoDomain) {
        const domainName = hideLogoDomain.split(".")[0];
        setTitle(domainName || "stellenapp");
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
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
