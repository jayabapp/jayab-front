export type BlogDetailsRouteProps = {
  params: Promise<{ blog_id: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export type PropertyDetailsRouteProps = {
  params: Promise<{ room_slug: string }>;
};
