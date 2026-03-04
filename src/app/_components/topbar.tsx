// =============================================================================
// topbar.tsx — App-wide navigation bar (like Phoenix's app.html.heex header)
// =============================================================================
// This is a SERVER component — no "use client" needed.
// It renders the top navigation bar with links to each resource.
//
// Phoenix equivalent:
//   The <nav> section in lib/myapp_web/components/layouts/app.html.heex
//
// USAGE (in layout.tsx):
//   import { Topbar } from "./_components/topbar";
//   <Topbar />
//
// TO ADD A NEW LINK:
//   Just add another object to the `links` array below.
// =============================================================================

import Link from "next/link";

// --- Configuration -----------------------------------------------------------
// Add your routes here. Each entry becomes a nav link.
// Phoenix equivalent: the <.link> items in your app.html.heex nav.
const links = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Items" },
  { href: "/products", label: "Products" },
] as const;

// --- Component ---------------------------------------------------------------

export function Topbar() {
  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* App name — like the logo area in Phoenix's app layout */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          MyApp
        </Link>

        {/* Nav links — like the <nav> links in app.html.heex */}
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
