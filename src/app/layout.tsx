import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";


export const metadata: Metadata = {
  title: "BrewnCode",
  description: "BrewnCode next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white transition-colors duration-300 min-h-screen">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
