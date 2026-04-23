import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add declarations for HTML elements or custom components here
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      // Add more as needed
    }
  }
}
