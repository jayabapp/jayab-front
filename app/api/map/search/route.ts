import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/utils/sessionCookie";

import type { SearchedLocation } from "@/types/features/map";

import {
  fetchNeshan,
  invalidMapRequest,
  mapJson,
  parseIranPoint,
  parseSearchTerm,
} from "@/utils/neshanProxy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const params = request.nextUrl.searchParams;
  const term = parseSearchTerm(params);
  const point = parseIranPoint(params);
  if (!term || !point) return invalidMapRequest();

  const result = await fetchNeshan<{ items?: SearchedLocation[] }>(
    "/v1/search",
    { term, lat: String(point.lat), lng: String(point.lng) },
  );
  if (result instanceof NextResponse) return result;
  return mapJson({ items: result.items ?? [] });
}
