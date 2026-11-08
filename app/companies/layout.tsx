"use client";

import HideDomainGuard from "@/app/components/hideDomainGuard";
import PublicHeader from "@/app/components/publicHeader";

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HideDomainGuard>
      <PublicHeader />
      {children}
    </HideDomainGuard>
  );
}
