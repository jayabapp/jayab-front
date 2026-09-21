import { NextResponse } from "next/server";

const NESHAN_API_ORIGIN = "https://api.neshan.org";
const UPSTREAM_TIMEOUT_MS = 8000;
const CACHE_CONTROL = "private, max-age=60";

const IRAN_LAT_RANGE = [24, 40] as const;
const IRAN_LNG_RANGE = [44, 64] as const;

export const SEARCH_TERM_MIN_LENGTH = 3;
export const SEARCH_TERM_MAX_LENGTH = 100;

const badRequest = () => NextResponse.json({ error: "bad_request" }, { status: 400 });

const parseCoordinate = (
  raw: string | null,
  [min, max]: readonly [number, number],
) => {
  if (!raw || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
};

export const parseIranPoint = (params: URLSearchParams) => {
  const lat = parseCoordinate(params.get("lat"), IRAN_LAT_RANGE);
  const lng = parseCoordinate(params.get("lng"), IRAN_LNG_RANGE);
  return lat === null || lng === null ? null : { lat, lng };
};

export const parseSearchTerm = (params: URLSearchParams) => {
  const term = (params.get("term") ?? "").trim();
  return term.length >= SEARCH_TERM_MIN_LENGTH &&
    term.length <= SEARCH_TERM_MAX_LENGTH
    ? term
    : null;
};

export const invalidMapRequest = badRequest;

/** The service key stays on the server; browsers only ever see /api/map/*. */
export const fetchNeshan = async <T>(
  path: string,
  params: Record<string, string>,
): Promise<NextResponse | T> => {
  const apiKey = process.env.NESHAN_SERVICE_KEY;
  if (!apiKey)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    const upstream = await fetch(
      `${NESHAN_API_ORIGIN}${path}?${new URLSearchParams(params)}`,
      {
        headers: { "Api-Key": apiKey },
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        cache: "no-store",
      },
    );
    if (!upstream.ok)
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    return (await upstream.json()) as T;
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
};

export const mapJson = (body: unknown) =>
  NextResponse.json(body, { headers: { "Cache-Control": CACHE_CONTROL } });
