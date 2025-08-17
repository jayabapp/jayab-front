import { apiRoutes, baseUrl } from "@/utils/urls";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const access_token = searchParams.get("token") || "";

  const HEADERS: {
    Accept: string;
    Authorization: string;
    "Content-Type": string;
  } = {
    Accept: `application/json`,
    "Content-Type": `application/json`,
    Authorization: `Bearer ${access_token}`,
  };

  const config = {
    method: "GET",
    headers: HEADERS,
  };
  try {
    const response = await fetch(`${baseUrl}${apiRoutes.ADMIN_EDIT_VALIDATE}`, {
      ...config,
    });
    if (response.status == 401) {
      return NextResponse.json({ data: { revalidate: false } }, { status: 401 });
    }
    const json = await response.json();
    const data = json.data;
    if (!!data?.can_edit) {
      revalidatePath("/", "layout");
      return NextResponse.json({ data: { revalidated: true } }, { status: 200 });
    } else {
      return NextResponse.json({ data: { revalidate: false } }, { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
