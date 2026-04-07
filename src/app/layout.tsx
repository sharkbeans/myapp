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
import "./globals.css";
import { Topbar } from "./_components/topbar";

export const metadata: Metadata = {
  title: "MyApp CRUD Template",
  description:
    "Cloneable Next.js CRUD scaffold with items and products examples",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Topbar appears on every page — like the nav in app.html.heex */}
        <Topbar />
        {children}
      </body>
    </html>
  );
}
