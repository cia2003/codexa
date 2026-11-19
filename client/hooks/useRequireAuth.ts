"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuthUser } from "@/lib/api/auth";

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const isLoggedIn = Boolean(getStoredAuthUser());
      setIsAuthorized(isLoggedIn);
      setIsAuthReady(true);

      if (!isLoggedIn) router.replace("/login");
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener("codexa-auth-change", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("codexa-auth-change", syncAuth);
    };
  }, [router]);

  return isAuthReady && isAuthorized;
}
