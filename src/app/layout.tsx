import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "~/components/navbar";
import { PostHogProvider } from "./posthog-provider";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstantOutfits — AI-Powered Style",
  description:
    "Upload your wardrobe, take the style quiz, get dressed effortlessly every day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <PostHogProvider>
          <ThemeProvider>
            <Navbar />
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
