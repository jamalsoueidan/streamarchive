"use client";

import { useCallback, useEffect, useState } from "react";

const COOKIE_NAME = "watchLater";

function getCookie(name: string): string[] {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  if (value) {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return [];
    }
  }
  return [];
}

function setCookie(name: string, value: string[]) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  // Set cookie for 1 year, path=/ so it's available everywhere
  document.cookie = `${name}=${encoded}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function useWatchLater() {
  const [watchLater, setWatchLater] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from cookie on mount
  useEffect(() => {
    const loadFromCookie = () => {
      setWatchLater(getCookie(COOKIE_NAME));
      setIsInitialized(true);
    };

    loadFromCookie();

    // Custom event for same-tab updates
    const handleCustomEvent = () => loadFromCookie();
    window.addEventListener("watchLaterChanged", handleCustomEvent);

    return () => {
      window.removeEventListener("watchLaterChanged", handleCustomEvent);
    };
  }, []);

  // Save to cookie and notify other components
  const saveToCookie = useCallback((items: string[]) => {
    setCookie(COOKIE_NAME, items);
    setWatchLater(items);
    window.dispatchEvent(new Event("watchLaterChanged"));
  }, []);

  const addToWatchLater = useCallback(
    (documentId: string) => {
      if (!watchLater.includes(documentId)) {
        saveToCookie([...watchLater, documentId]);
      }
    },
    [watchLater, saveToCookie],
  );

  const removeFromWatchLater = useCallback(
    (documentId: string) => {
      saveToCookie(watchLater.filter((id) => id !== documentId));
    },
    [watchLater, saveToCookie],
  );

  const isInWatchLater = useCallback(
    (documentId: string) => {
      return watchLater.includes(documentId);
    },
    [watchLater],
  );

  const toggleWatchLater = useCallback(
    (documentId: string) => {
      if (isInWatchLater(documentId)) {
        removeFromWatchLater(documentId);
      } else {
        addToWatchLater(documentId);
      }
    },
    [isInWatchLater, removeFromWatchLater, addToWatchLater],
  );

  const clearWatchLater = useCallback(() => {
    saveToCookie([]);
  }, [saveToCookie]);

  return {
    watchLater,
    isInitialized,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
    toggleWatchLater,
    clearWatchLater,
  };
}
