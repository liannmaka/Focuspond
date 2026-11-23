"use client";

import { useTranslations } from "next-intl";
import { CloudOff, RefreshCw, Wifi } from "lucide-react";

import Button from "@/components/ui/Button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * The screen the service worker shows when a navigation cannot be served.
 *
 * It is already precached (`next.config.ts`) and already wired as the document
 * fallback (`src/app/sw.ts`), so this has been live the whole time — as
 * `<div>offline page</div>`, exported from a function misnamed `LoginPage`.
 * An installed app's first failure is the worst moment to look broken.
 *
 * What it says matters more than how it looks: FocusPond's data lives in
 * IndexedDB on the device, so being offline costs almost nothing here. The
 * honest message is "most of this still works", not an apology.
 *
 * It watches the connection rather than making the reader guess — when it comes
 * back, the page says so and offers a way on instead of leaving them poking at
 * a reload button.
 */
export default function OfflinePage() {
  const t = useTranslations("common.offline");
  const online = useOnlineStatus();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      {online ? (
        <Wifi
          className="size-7 text-success"
          aria-hidden
        />
      ) : (
        <CloudOff
          className="size-7 text-ink-subtle"
          aria-hidden
        />
      )}

      <h1 className="font-sora text-2xl font-semibold tracking-[-0.02em] text-ink">
        {online ? t("restored") : t("title")}
      </h1>

      <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
        {t("body")}
      </p>

      {online ? (
        <Button
          href="/home/today"
          className="mt-2"
        >
          {t("continue")}
        </Button>
      ) : (
        /*
          A reload, not a router navigation: the point is to ask the network
          again, and client-side routing would be served the same cached
          fallback without ever trying.
        */
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
          leftIcon={
            <RefreshCw
              className="size-3.5"
              aria-hidden
            />
          }
        >
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
