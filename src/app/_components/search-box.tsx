// =============================================================================
// search-box.tsx — Search input with debounced URL navigation
// =============================================================================
// A text input that updates the URL's ?q= param when the user types.
// This is a CLIENT component because it uses state + router.
//
// Phoenix equivalent:
//   A <form> with phx-change="search" in a LiveView, or a regular form
//   that submits GET to the index action with a ?q= param.
//
// USAGE (in any index page):
//   import { SearchBox } from "@/app/_components/search-box";
//   <SearchBox basePath="/items" searchParams={searchParams} />
//
// COPY-PASTE: Just change basePath.
// =============================================================================

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { buildPaginationUrl } from "../_lib/pagination";

type Props = {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
};

export function SearchBox({ basePath, searchParams }: Props) {
  const router = useRouter();
  const currentQuery = typeof searchParams.q === "string" ? searchParams.q : "";
  const [value, setValue] = useState(currentQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input with URL when searchParams change (e.g. browser back button)
  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    // Debounce: wait 300ms after the user stops typing before navigating.
    // This prevents a URL change on every keystroke.
    // Phoenix LiveView does this automatically with phx-debounce="300".
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const url = buildPaginationUrl(basePath, searchParams, {
        q: newValue || undefined,
        page: 1, // reset to page 1 when searching
      });
      router.push(url);
    }, 300);
  }

  // Allow immediate search on Enter (skip debounce)
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current);
      const url = buildPaginationUrl(basePath, searchParams, {
        q: value || undefined,
        page: 1,
      });
      router.push(url);
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Search..."
      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
    />
  );
}
