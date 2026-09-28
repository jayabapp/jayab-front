// Bypasses the Basic Auth gate (see `helpers/basicAuthGate.ts`,
// `BASIC_AUTH_HEALTHCHECK_PATH`) so a load balancer or uptime monitor never
// marks a gated deployment unhealthy. Reveals nothing beyond liveness.
export async function GET() {
  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
