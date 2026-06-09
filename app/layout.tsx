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
  const [title, setTitle] = useState("");

  useEffect(() => {
    const hideLogoDomain = process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN;
    if (typeof window !== "undefined") {
      if (hideLogoDomain && window.location.hostname === hideLogoDomain) {
        const domainName = hideLogoDomain.split(".")[0];
        setTitle(domainName || "stellenapp");
      } else {
        setTitle("fachzubi");
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var hideLogoDomain = "${process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN || ""}";
                if (hideLogoDomain && window.location.hostname === hideLogoDomain) {
                  var domainName = hideLogoDomain.split(".")[0];
                  document.title = domainName || "stellenapp";
                } else {
                  document.title = "fachzubi";
                }
              })();
            `,
          }}
        />
        {title && <title>{title}</title>}
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
