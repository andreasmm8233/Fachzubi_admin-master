"use client";

import HideDomainGuard from "@/app/components/hideDomainGuard";
import PublicHeader from "@/app/components/publicHeader";

export default function JobsLayout({
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
