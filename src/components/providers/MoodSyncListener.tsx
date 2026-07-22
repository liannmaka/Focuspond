"use client";
import { useEffect, useRef, useState } from "react";

// get user id when you implement authentication, the below is for the page router
// import { useSession } from "@supabase/auth-helpers-react";
// import { syncMoodsToSupabase } from "@/lib/pwa/sync/moodSync";

function createUserId() {
  if (typeof window === "undefined") return null;

  let userId = localStorage.getItem("mood_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("mood_user_id", userId);
  }
  return userId;
}

export function MoodSyncListener() {
  //   const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const periodicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUserId(createUserId());
  }, []);

  useEffect(() => {
    // if (!session?.user?.id) return;

    // const userId = session.user.id;

    if (!userId) return;

    // const debouncedSync = () => {
    //   if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    //   syncTimeoutRef.current = setTimeout(() => {
    //     if (navigator.onLine) {
    //       syncMoodsToSupabase(userId);
    //     }
    //   }, 2000);
    //   console.log("syncing...");
    // };

    // debouncedSync();

    // const handleOnline = () => {
    //   console.log("Network reconnected, syncing...");
    //   debouncedSync();
    // };
    // window.addEventListener("online", handleOnline);

    // periodicIntervalRef.current = setInterval(
    //   () => {
    //     if (navigator.onLine) {
    //       console.log("Periodic sync triggered");
    //       syncMoodsToSupabase(userId);
    //     }
    //   },
    //   5 * 60 * 1000
    // );

    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "visible" && navigator.onLine) {
    //     console.log("👁️ Tab visible, syncing...");
    //     debouncedSync();
    //   }
    // };
    // document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // window.removeEventListener("online", handleOnline);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (periodicIntervalRef.current)
        clearInterval(periodicIntervalRef.current);
    };
  }, [userId]);

  return null;
}
