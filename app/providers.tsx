"use client";

import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light" // Force 'light' as the default
      enableSystem={false} // Don’t detect the OS theme
    >
      {children}
    </ThemeProvider>
  );
}
