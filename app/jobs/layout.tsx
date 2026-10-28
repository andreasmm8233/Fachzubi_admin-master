"use client";

import HideDomainGuard from "@/app/components/hideDomainGuard";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HideDomainGuard>{children}</HideDomainGuard>;
}
