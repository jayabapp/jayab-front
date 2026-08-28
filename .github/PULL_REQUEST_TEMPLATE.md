## Scope

- Feature/module:
- Routes affected:
- Rollback commit or feature flag:

## Architecture

- Before: `page -> ...`
- After: `page -> template -> module -> client island -> feature hook`
- Server files:
- Client islands:

## Evidence

- Requests before / after:
- Route chunk or bundle before / after (when material):
- Desktop, mobile and RTL scenarios tested:
- Direct navigation, client navigation and back/forward tested:
- Loading, empty, error and success states tested:
- Slow network, cancellation, double-submit and unmount tested:
- Skeleton/CLS, dark mode and reduced-motion checked:
- Public/SEO content checked without JavaScript when applicable:

## Release

- [ ] `yarn migration:verify:build` passes
- [ ] Stage uses the real or contract-compatible API
- [ ] Monitoring owner and 24–48 hour window are defined
- [ ] JS errors, 4xx/5xx, request rate, latency and Web Vitals dashboards are ready
- [ ] Auth, Chat, Payment, Reservation or Owner Calendar changes use a flag/canary
- [ ] Independent rollback has been rehearsed

