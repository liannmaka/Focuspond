"use client";

import { useEffect, useState } from "react";

import { db } from "./indexedDB";

/**
 * Whether the database opened at all.
 *
 * The failure this catches is rarer than a refused write and much worse: with
 * site data blocked, in some private-browsing modes, or when another tab holds
 * the database open at an older version, `db.open()` rejects and **every live
 * query simply never resolves**.
 *
 * Nothing above would notice. Live queries return `undefined` while they
 * resolve, which is also what they return forever in this case — so since the
 * loading skeletons went in, an unopenable database looks exactly like a slow
 * one. The app would sit there shimmering, politely, for good.
 *
 * `blocked` is worth keeping separate from `failed`: it means another tab is
 * holding an old version open, which the reader can actually fix by closing
 * it, where a refused database is usually a browser setting.
 */
export type DatabaseStatus = "opening" | "open" | "blocked" | "failed";

export function useDatabaseStatus(): DatabaseStatus {
  const [status, setStatus] = useState<DatabaseStatus>(() =>
    db.isOpen() ? "open" : "opening"
  );

  useEffect(() => {
    let active = true;

    // Dexie fires this when another tab holds an older version open, instead
    // of rejecting — the open simply waits, which would otherwise be
    // indistinguishable from a slow start.
    const onBlocked = () => active && setStatus("blocked");
    db.on("blocked", onBlocked);

    db.open()
      .then(() => active && setStatus("open"))
      .catch((error) => {
        console.error("FocusPond: the database would not open", error);
        if (active) setStatus("failed");
      });

    return () => {
      active = false;
      db.on("blocked").unsubscribe(onBlocked);
    };
  }, []);

  return status;
}
