## Scope

- Feature/module:
- Routes affected:
- Rollback commit or feature flag:

## Architecture

- Before: `page -> ...`
- After: `page -> template -> module -> client island -> feature hook`
- Server files:
- Client islands:

- [ ] Every module has one responsibility and a public `index.ts`
- [ ] Private parts stay inside their owning module
- [ ] Business/data behavior is owned by a feature hook
- [ ] Client islands are minimal and close to the interaction
- [ ] Component props/types live in the centralized `types/` ownership tree
- [ ] Imports follow aliases and layer direction

## Evidence

- Requests before / after:
- Route chunk or bundle before / after (when material):
- Desktop, mobile and RTL scenarios tested:
- Direct navigation, client navigation and back/forward tested:
- Loading, empty, error and success states tested:
- Slow network, cancellation, double-submit and unmount tested:
- Skeleton/CLS, dark mode and reduced-motion checked:
- Public/SEO content checked without JavaScript when applicable:

- [ ] Keyboard, focus, ARIA and disabled states were checked
- [ ] Query data was not duplicated into local or Zustand state
- [ ] Timers, debounce, DOM events, object URLs and socket listeners clean up
- [ ] Images use correct `sizes`; `fill` has a stable parent; preload is limited to measured LCP

## Release

- [ ] `yarn migration:verify:build` passes
- [ ] Stage uses the real or contract-compatible API
- [ ] Monitoring owner and 24–48 hour window are defined
- [ ] JS errors, 4xx/5xx, request rate, latency and Web Vitals dashboards are ready
- [ ] Auth, Chat, Payment, Reservation or Owner Calendar changes use a flag/canary
- [ ] Independent rollback has been rehearsed
