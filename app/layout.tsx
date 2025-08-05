// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "documentation",
  description: "Welcome to my personal documentation website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Top Radial Gradient */}
          <div
            className="
            absolute
            top-0
            left-0
            w-full
            h-screen
            -z-10
            bg-[radial-gradient(circle_at_50%_-55%,_rgba(58,169,221,1)_0%,_transparent_65%)]
            dark:bg-[radial-gradient(circle_at_50%_-55%,_rgba(25,226,247,0.6)_10%,_transparent_65%)]
          "
          />
          {/* Container for entire page */}
          <div className="relative min-h-screen flex flex-col">
            {/* NavBar */}

            {/* Main content grows to fill space above footer */}
            <main className="flex-grow">{children}</main>

            {/* Footer at the bottom */}
            <Footer />

            {/*
              ---------------------------------------------------------
              BOTTOM BACKGROUND & WAVE
              ---------------------------------------------------------
              1) Absolutely positioned behind everything (i.e., -z-10).
              2) The 'inset-0' covers the entire page, but we'll rely on
                 the radial gradient being anchored at the bottom.
              3) The wave is anchored at the very bottom.
            */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
              {/* Bottom Radial Gradient (fills entire page, but anchored visually at bottom) */}
              <div
                className="
                  w-full h-full
                  bg-[radial-gradient(circle_at_50%_145%,_rgba(58,169,221,1)_0%,_transparent_65%)]
                  dark:bg-[radial-gradient(circle_at_50%_145%,_rgba(25,226,247,0.6)_10%,_transparent_65%)]
                "
              />

              {/* Wave Mask pinned at bottom (some fixed height for wave overlap) */}
              <div
                className="absolute bottom-0 left-0 w-full h-64"
                style={{
                  maskImage: "url('/waves-white.svg')",
                  maskSize: "cover",
                  maskRepeat: "no-repeat",
                  maskPosition: "top center",
                  WebkitMaskImage: "url('/waves-white.svg')",
                  WebkitMaskSize: "cover",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "top center",
                }}
              >
                {/* Gradient that shows through the wave shape */}
                <div className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-100 dark:from-gray-50 dark:to-gray-900" />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
