"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shouldHideLogo } from "@/app/ulits/hideLogo";

// On white-label domains (e.g. stellenapp.de) the public pages are only
// visible after login; logged-out visitors are sent back to the login page.
const HideDomainGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (shouldHideLogo() && !localStorage.getItem("x-access")) {
      router.replace("/");
      return;
    }
    setAllowed(true);
  }, [router]);

  return allowed ? <>{children}</> : null;
};

export default HideDomainGuard;
