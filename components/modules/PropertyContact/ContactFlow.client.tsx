"use client";

import { useContext, useMemo, useRef, useState } from "react";
import { useAuthStore, useChatStore } from "@/store";
import { createContext, useCallback } from "react";
import { useStaySearchParams } from "@features/reservations/hooks/useStaySearchParams";
import { buildContactPrefill } from "@features/reservations/lib/contact-prefill";
import { useStartOrFindChat } from "@features/chat/hooks/useStartOrFindChat";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useContactIntent } from "@features/reservations/hooks/useContactIntent";
import { useRouter } from "next/navigation";

import type { ContactFlowAction } from "@/types/components/modules/property-contact";
import type { ContactFlowValue } from "@/types/components/modules/property-contact";
import type { ContactFlowProps } from "@/types/components/modules/property-contact";
import type { ContactSession } from "@/types/components/modules/property-contact";
import type { ContactStay } from "@/types/components/modules/property-contact";

import ReserveConfirmSheet from "./parts/ReserveConfirmSheet.client";
import PropertyContactModal from "./PropertyContactModal.client";

const ContactFlowContext = createContext<ContactFlowValue | null>(null);

export const useContactFlow = () => {
  const value = useContext(ContactFlowContext);
  if (!value)
    throw new Error("useContactFlow must be used inside <ContactFlow>");
  return value;
};

const ContactFlow = ({ children, property }: ContactFlowProps) => {
  const router = useRouter();
  const isLogin = useAuthStore((state) => state.isLogin);
  const { authUrlFor } = useStaySearchParams(property.maxCapacity);
  const { isPending: isChatPending, mutate: findChat } = useStartOrFindChat();
  const [session, setSession] = useState<ContactSession | null>(null);
  const nonce = useRef(0);

  const isExpired = !property.remainingDays;
  const canChat = property.isChatEnabled && !isExpired;

  const openChat = useCallback(
    (stay: ContactStay) => {
      findChat(
        { property_id: property.id },
        {
          onSuccess: (response) => {
            if (!response?.chatroom_id) return;
            useChatStore.setState({
              chatDraft: {
                chatId: `${response.chatroom_id}`,
                text: buildContactPrefill({
                  ...stay,
                  code: property.code,
                  title: property.title,
                }),
              },
            });
            router.push(`/chat/${response.chatroom_id}`);
          },
        },
      );
    },
    [findChat, property.code, property.id, property.title, router],
  );

  const open = useCallback(
    (action: ContactSession["action"], stay: ContactStay) => {
      nonce.current += 1;
      setSession({ action, nonce: nonce.current, stay });
    },
    [],
  );

  const start = useCallback(
    (action: ContactFlowAction, stay: ContactStay) => {
      trackListingEvent("host_contact_action", {
        action,
        guests: stay.guests,
        is_expired: isExpired,
        nights: stay.nights,
      });
      const isAllowed = isExpired
        ? action === "reserve"
        : action !== "chat" || canChat;
      if (!isAllowed) return;

      if (!isLogin) {
        trackListingEvent("booking_auth_required", { intent: action });
        router.push(
          authUrlFor(action, {
            end: stay.endDate,
            guests: stay.guests,
            start: stay.startDate,
          }),
        );
        return;
      }
      if (action === "chat") {
        if (!isChatPending) openChat(stay);
        return;
      }
      open(action, stay);
    },
    [
      authUrlFor,
      canChat,
      isChatPending,
      isExpired,
      isLogin,
      open,
      openChat,
      router,
    ],
  );

  useContactIntent(property.id, property.maxCapacity, (intent, stay) =>
    start(intent, stay),
  );

  const value = useMemo(
    () => ({ isChatPending, start }),
    [isChatPending, start],
  );
  const closeSession = () => setSession(null);

  return (
    <ContactFlowContext.Provider value={value}>
      {children}

      {session?.action === "call" || session?.action === "sms" ? (
        <PropertyContactModal
          show
          key={session.nonce}
          type={session.action}
          onHide={closeSession}
          propertySlug={property.slug}
          trip={{
            ...session.stay,
            code: property.code,
            title: property.title,
          }}
        />
      ) : null}

      {session?.action === "reserve" ? (
        <ReserveConfirmSheet
          key={session.nonce}
          property={property}
          stay={session.stay}
          onHide={closeSession}
          onCall={() => open("call", session.stay)}
          onChat={canChat ? () => openChat(session.stay) : undefined}
        />
      ) : null}
    </ContactFlowContext.Provider>
  );
};

export default ContactFlow;
