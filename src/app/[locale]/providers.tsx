"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={timeZone}
      >
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
}
