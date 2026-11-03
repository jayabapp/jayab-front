import type { ReactNode } from "react";
import type { Messages } from "next-intl";
import { getMessages } from "next-intl/server";

import MergeMessages from "./MergeMessages.client";

type IntlNamespacesProps = {
  namespaces: readonly (keyof Messages)[];
  children: ReactNode;
};

// Page-level provider: sends only the namespaces this route's client components
// read, on top of the chrome ones from the root layout. scripts/i18n/namespaces.mjs
// checks the list against the real import graph.
const IntlNamespaces = async ({ namespaces, children }: IntlNamespacesProps) => {
  const messages = await getMessages();
  const extra = Object.fromEntries(
    namespaces.map((name) => [name, messages[name]]),
  );
  return <MergeMessages extra={extra}>{children}</MergeMessages>;
};

export default IntlNamespaces;
