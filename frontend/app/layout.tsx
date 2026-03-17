import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "smolurls",
  description: "Fast & free URL shortener with analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} bg-background text-foreground antialiased`}
      >
        <TooltipProvider>
          <Navbar />
          <main className="min-h-screen pt-20">
            <PageTransition>{children}</PageTransition>
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
