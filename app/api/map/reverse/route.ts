import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/utils/sessionCookie";

import {
  fetchNeshan,
  invalidMapRequest,
  mapJson,
  parseIranPoint,
} from "@/utils/neshanProxy";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const point = parseIranPoint(request.nextUrl.searchParams);
  if (!point) return invalidMapRequest();

  const result = await fetchNeshan<{ formatted_address?: string }>(
    "/v5/reverse",
    { lat: String(point.lat), lng: String(point.lng) },
  );
  if (result instanceof NextResponse) return result;
  return mapJson({ formatted_address: result.formatted_address ?? "" });
}
