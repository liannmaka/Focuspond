"use client";

import { useEffect, useState } from "react";

/**
 * Whether the browser currently has a network connection.
 *
 * Starts as `true` and corrects itself after mount, deliberately: there is no
 * `navigator` on the server, so reading it in the initial state would either
 * crash the render or make the server and the client disagree about what to
 * paint. Assuming online and stepping back is also the kinder failure — a page
 * that flashes "you are offline" at someone who isn't is worse than one that
 * takes a tick to notice.
 *
 * **It answers a narrower question than it looks like.** `navigator.onLine`
 * reports whether there is *an* interface up, not whether anything is reachable
 * through it: a captive portal, a dead router or a down server all read as
 * online. So treat `true` as "worth trying" rather than "connected", and never
 * let it gate access to local data — FocusPond's data is on the device, and a
 * connection has nothing to do with whether it can be read.
 */
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    // Once, immediately: the events only fire on *changes*, so a tab that was
    // already offline when it opened would otherwise never hear about it.
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return online;
}
