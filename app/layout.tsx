// RootLayout.tsx
import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Providers from "./providers";
import "./globals.css";
import { getBrand } from "./ulits/hideLogo";

// Title/description are rendered on the server per request domain, so search
// engines see "Stellenapp" on stellenapp.de and "UniBonus" everywhere else.
export async function generateMetadata(): Promise<Metadata> {
  const brand = getBrand(headers().get("host"));
  const description = `${brand.name} – Clever informieren in deiner UniStadt!`;
  return {
    title: brand.name,
    description,
    applicationName: brand.name,
    openGraph: {
      title: brand.name,
      description,
      siteName: brand.name,
      url: `https://${brand.domain}`,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
