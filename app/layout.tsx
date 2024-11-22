import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tap Master | Craft The Future",
  description: "The ultimate arcade tapping game - Test your speed and precision!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={pressStart2P.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-arcade-orange/90 to-arcade-pink/90 dark:from-arcade-orange/30 dark:to-arcade-pink/30 dark:bg-gray-900">
            <header className="p-4 text-black dark:text-white border-b-4 border-black dark:border-white backdrop-blur-sm bg-white/20 dark:bg-black/20">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-3xl text-center animate-pulse neon-text">
                    TAP MASTER
                  </h1>
                  <p className="text-xs md:text-sm text-center mt-1 opacity-80">
                    Powered by Craft The Future
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="theme-toggle" aria-label="Toggle theme">
                    🌓
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <footer className="p-4 text-black dark:text-white border-t-4 border-black dark:border-white backdrop-blur-sm bg-white/20 dark:bg-black/20">
              <div className="container mx-auto text-center">
                <p className="text-xs md:text-sm">© 2024 Craft The Future - Open Source Gaming</p>
                <p className="text-[10px] md:text-xs mt-1 opacity-70">
                  Built for fun, competition, and endless tapping!
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
