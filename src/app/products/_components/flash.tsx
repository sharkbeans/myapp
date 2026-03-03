"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Flash() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("flash");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      // Clean the flash param from URL without navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("flash");
      window.history.replaceState({}, "", url.pathname);

      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="mb-4 flex items-center justify-between rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="ml-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
      >
        &times;
      </button>
    </div>
  );
}
