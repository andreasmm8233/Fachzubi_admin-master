import React from "react";
import AuthChecker from "./unauthChecker";

function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthChecker />
      {children}
    </>
  );
}

export default LoginLayout;
