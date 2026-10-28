// RootLayout.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import ThemeCustomization from "@/themes";
import LocalStorageEvent from "./localStorageEvent";
import "./globals.css";
import { getHideLogoDomain, getHideLogoDomains } from "./ulits/hideLogo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    const hideLogoDomain = getHideLogoDomain();
    setTitle(hideLogoDomain ? hideLogoDomain.split(".")[0] : "fachzubi");
  }, []);

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var domains = ${JSON.stringify(getHideLogoDomains())};
                var host = window.location.hostname.toLowerCase().replace(/^www\\./, "");
                var match = domains.find(function (d) {
                  return host === d || host.slice(-(d.length + 1)) === "." + d;
                });
                document.title = match ? match.split(".")[0] : "fachzubi";
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
