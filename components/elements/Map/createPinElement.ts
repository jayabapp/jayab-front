import type { MapPinOptions } from "@/types/components/elements/map";

const SVG_NS = "http://www.w3.org/2000/svg";

const HOME_PATHS = [
  "M3.25 10.75 12 3.5l8.75 7.25",
  "M5.5 9.5v10.75h13V9.5",
  "M10 20.25V14.5h4v5.75",
];

const svgNode = (name: string, attributes: Record<string, string>) => {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) =>
    node.setAttribute(key, value),
  );
  return node;
};

export const createPinElement = ({ animate = false }: MapPinOptions = {}) => {
  const root = document.createElement("div");
  root.className = "relative h-11 w-9 pointer-events-none";

  if (animate) {
    const pulse = document.createElement("span");
    pulse.className =
      "map-pin-pulse absolute bottom-0 left-1/2 size-10 rounded-full bg-brand-500/25";
    root.appendChild(pulse);
  }

  const body = document.createElement("span");
  body.className = `map-pin-body absolute inset-0 text-brand-600${animate ? " map-pin-drop" : ""}`;

  const svg = svgNode("svg", {
    viewBox: "0 0 36 44",
    width: "36",
    height: "44",
    "aria-hidden": "true",
  });
  svg.appendChild(
    svgNode("path", {
      d: "M18 44S34 28.5 34 16A16 16 0 1 0 2 16c0 12.5 16 28 16 28Z",
      fill: "currentColor",
    }),
  );
  const glyph = svgNode("g", {
    transform: "translate(8 6) scale(0.8333)",
    fill: "none",
    stroke: "white",
    "stroke-width": "1.75",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });
  HOME_PATHS.forEach((d) => glyph.appendChild(svgNode("path", { d })));
  svg.appendChild(glyph);
  body.appendChild(svg);
  root.appendChild(body);
  return root;
};

export const createAreaLabelElement = (text: string) => {
  const label = document.createElement("span");
  label.className =
    "pointer-events-none rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-glass-sm";
  label.textContent = text;
  return label;
};
