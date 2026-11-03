export const IRAN_CENTER: [number, number] = [53.69, 32.43];
export const FLIGHT_START_ZOOM = { mobile: 2.2, desktop: 2.6 };
export const FLIGHT_END_ZOOM = { exact: 15, approx: 13.5 };
export const FLIGHT = { speed: 0.9, curve: 1.5, maxDuration: 4000 } as const;

// Gives the first tiles a moment to paint so the flight starts from a drawn map.
export const FLIGHT_START_DELAY_MS = 400;
export const LANDING_IDLE_TIMEOUT_MS = 1500;
export const FLIGHT_VISIBLE_THRESHOLD = 0.35;
export const MAP_LAZY_ROOT_MARGIN = "800px 0px";
export const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";
