// =============================================================================
// Root Layout — Wraps every page (like app.html.heex in Phoenix)
// =============================================================================
// This is the equivalent of lib/myapp_web/components/layouts/app.html.heex
// in Phoenix. It wraps ALL pages with:
//   - <html> and <body> tags
//   - The Topbar navigation
//   - Fonts and global CSS
//
// You don't need to touch this file unless you're adding something that
// should appear on EVERY page (like a footer, or a global provider).
// =============================================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Topbar } from "./_components/topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyApp",
  description: "Next.js CRUD scaffold — like mix phx.gen.html",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Topbar appears on every page — like the nav in app.html.heex */}
        <Topbar />
        {children}
      </body>
    </html>
  );
}
