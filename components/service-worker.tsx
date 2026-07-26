"use client";

import { useEffect } from "react";
import { basePath } from "@/lib/base-path";

export function ServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker
      .register(`${basePath}/sw.js`, {
        scope: `${basePath}/`,
      })
      .catch(() => {});
  }, []);

  return null;
}
