import type { ClusterMarkerOptions } from "@/types/components/elements/map";
import type { PricePinOptions } from "@/types/components/elements/map";
import type { MapMarkerState } from "@/types/components/elements/map";

const base = (tag: "button", className: string, key: string) => {
  const element = document.createElement(tag);
  element.type = "button";
  element.className = className;
  element.dataset.mapKey = key;
  return element;
};

const HEART_SRC = "/assets/icons/adds/filled_heart.svg";

export const createPricePinElement = ({
  key,
  label,
  hearts,
  title,
  ariaLabel,
  approximate,
}: PricePinOptions) => {
  const element = base("button", "map-price-pin", key);
  const price = document.createElement("span");
  price.dir = "auto";
  price.textContent = label;
  element.append(price);
  if (hearts) {
    // The same filled heart and size the listing cards carry; it sits at the end.
    const icon = document.createElement("img");
    icon.alt = "";
    icon.width = 16;
    icon.height = 16;
    icon.src = HEART_SRC;
    const count = document.createElement("span");
    count.className = "map-pin-hearts";
    count.append(icon, hearts);
    element.append(count);
  }
  element.title = title;
  element.setAttribute("aria-label", ariaLabel);
  element.dataset.approx = String(approximate);
  return element;
};

export const createClusterElement = ({
  key,
  count,
  label,
  ariaLabel,
}: ClusterMarkerOptions) => {
  const element = base("button", "map-cluster", key);
  element.textContent = label;
  element.title = ariaLabel;
  element.dataset.count = String(count);
  element.setAttribute("aria-label", ariaLabel);
  return element;
};

export const setMarkerState = (element: HTMLElement, state: MapMarkerState) => {
  if (state === "idle") element.removeAttribute("data-state");
  else element.dataset.state = state;
  if (element.classList.contains("map-price-pin"))
    element.setAttribute("aria-pressed", String(state === "selected"));
};
