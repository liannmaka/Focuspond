import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { defaultLocale, namespaces } from "@/i18n/config";

/**
 * Every app component calls `useTranslations`, which throws outside a provider.
 * Rather than hand-maintain a fixture catalog that silently drifts from the
 * real copy, this loads the actual English messages — so a test that asserts on
 * visible text is asserting on the shipped string.
 */
const messages = Object.fromEntries(
  namespaces.map((ns) => [
    ns,
    JSON.parse(
      readFileSync(
        join(
          process.cwd(),
          "src",
          "i18n",
          "messages",
          defaultLocale,
          `${ns}.json`
        ),
        "utf8"
      )
    ),
  ])
);

export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider
        locale={defaultLocale}
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
