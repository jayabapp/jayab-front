"use client";

import type { ReactNode } from "react";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";

// Adds namespaces to the messages an ancestor provider already carries. A plain
// nested NextIntlClientProvider would replace them, so the parent's are spread in.
const MergeMessages = ({
  extra,
  children,
}: {
  extra: AbstractIntlMessages;
  children: ReactNode;
}) => {
  const parent = useMessages();
  const locale = useLocale();
  return (
    <NextIntlClientProvider locale={locale} messages={{ ...parent, ...extra }}>
      {children}
    </NextIntlClientProvider>
  );
};

export default MergeMessages;
