# Vue Template TS

The `Vue-template` starter in TypeScript. Same structure, same pages, same tests -
Pinia, vue-router, Tailwind 4, Vuelidate, a single axios data layer with a swappable
fake backend, ESLint + Prettier and Vitest, with types throughout.

If you want the JavaScript version, that is `Vue-template`. If you want a
feature-sliced structure for something larger, that is `vue-template-mega`.

The app lives in [`app/`](app/).

## Getting started

```bash
cd app
cp .env.example .env
npm install
npm run dev
```

For the demo data (posts, jobs), run json-server in a second terminal:

```bash
npm run mock          # serves data/db.json on http://localhost:3000
```

### Scripts

| Script               | What it does                                |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Vite dev server                             |
| `npm run build`      | Production build to `dist/`                 |
| `npm run preview`    | Serve the production build                  |
| `npm run mock`       | json-server against `data/db.json`          |
| `npm run typecheck`  | `vue-tsc` across app, node and test configs |
| `npm test`           | Vitest, once                                |
| `npm run test:watch` | Vitest in watch mode                        |
| `npm run lint`       | ESLint with `--fix`                         |
| `npm run lint:check` | ESLint, no writes (what CI runs)            |
| `npm run format`     | Prettier over `src/`                        |

### Environment

Only `VITE_`-prefixed variables reach the browser bundle, so nothing secret belongs in
`.env`. See [`app/.env.example`](app/.env.example). Vite does not load the
`.env.example` file directly: copy it to `app/.env.local` before starting the dev server.

- `VITE_API_URL` — base URL for every request the app makes.
- `VITE_MODE` — `local` installs the fake backend (`src/mocks/fake-backend.ts`) as the
  axios adapter, so `/login`, `/users` and `/contact` are answered in the browser and
  everything else falls through to `VITE_API_URL`. `remote` talks to the real API only.

Local demo credentials (available only with `VITE_MODE=local`):

| Role | Email | Password |
| --- | --- | --- |
| Patient | `test@gmail.com` | `test` |
| Patient | `joekaranja@gmail.com` | `joe123` |
| Responder | `responder@gmail.com` | `responder123` |
| Doctor | `doctor@gmail.com` | `doctor123` |
| Staff | `staff@gmail.com` | `staff123` |
| Admin | `admin@gmail.com` | `admin123` |

These accounts and credentials are browser-side demo data, not real authentication.
Frontend route guards only shape the demo experience; production authorization must be
implemented and enforced by the Spring Boot backend. Staff, doctor, and admin workspaces
are previews and do not display or control live hospital data.

The `/signup` page validates the form but does not create an account. There is no
registration service or registration endpoint in this project; do not treat a valid
form submission as successful registration.

## Project structure

```
app/src/
├── assets/          images/ and styles/ (tailwind.css holds the design tokens)
├── components/
│   ├── ui/          BaseButton, BaseInput, BaseCard, BaseBadge, BaseModal,
│   │                BaseSpinner, State{Loading,Empty,Error} - props in, events out
│   ├── common/      AppHeader, AppFooter, AppLogo - app chrome, may read stores
│   ├── auth/        LoginForm and its tests
│   ├── posts/       PostList, PostCard
│   └── jobs/        JobList
├── composables/     usePosts, useJobs, useContactForm - state + actions
├── constants/       routeNames, storageKeys
├── layouts/         DefaultLayout, AuthLayout, BlankLayout
├── mocks/           fake-backend.ts (an axios adapter)
├── router/          index.ts (wiring), routes.ts (table), guards.ts (auth guard)
├── services/        the only place that talks to the network
│   ├── http/        client.ts - the axios instance, interceptors, token handling
│   └── *.service.ts auth, users, posts, jobs, contact endpoints
├── stores/          Pinia stores; example.store.js is the reference pattern
├── types/           models.ts (API shapes) and router.d.ts (typed route meta)
├── utils/           format.ts, errors.ts - pure functions, no Vue, no network
└── views/           one component per route, kept thin (including SignupView)
```

### Public vs guarded routes

`router/routes.ts` groups routes by who can reach them. `meta.requiresAuth` protects a
route, while `meta.guestOnly` keeps signed-in users off the login and signup pages.

| Public                                          | Guests only        | Role-restricted workspaces                                |
| ----------------------------------------------- | ------------------ | --------------------------------------------------------- |
| `/` `/about` `/faq` `/contact` `/posts` `/jobs` | `/login` `/signup` | `/patient/*` `/responder/*` `/doctor/dashboard` `/staff/dashboard` `/admin/dashboard` |

Patient, responder, doctor, staff, and admin workspaces require the matching demo
role. The `/home`, `/api`, and detail routes require any valid demo session. These
frontend checks are navigation controls only; they are not production security.

The list pages are public while their detail pages are not - the "browse freely, sign in
to go deeper" split. Opening a detail page signed out redirects to `/login?returnUrl=...`
and returns you there afterwards. `router/routes.spec.ts` asserts this table, so moving a
page between the two columns is a deliberate act.

`/contact` is the worked example of a public page that still talks to the API: the rules
live in `composables/useContactForm.ts`, and the mock backend answers with a 422 carrying
per-field errors when you use an `@spam.test` address.

### Styling

Colour, font and radius live as tokens in
[`assets/styles/tailwind.css`](app/src/assets/styles/tailwind.css) under Tailwind 4's
`@theme`, so `bg-brand-600` comes from `--color-brand-600`. Change the palette there and
the whole app follows — no component hardcodes a brand colour. The same file defines the
`.page` / `.page-narrow` gutters and the `.muted` text colour that every view uses, plus a
single `:focus-visible` treatment.

Dark mode follows `prefers-color-scheme` and is implemented across every page, not just
the chrome. Lists, forms and error states all render through the shared primitives
(`BaseCard`, `BaseBadge`, `State{Loading,Empty,Error}`), so a new page gets the same
loading, empty and error treatment for free.

The header collapses to a toggle below `md`. The app mark lives in one component,
[`AppLogo`](app/src/components/common/AppLogo.vue), which renders
`public/logo-developers-mania.png` — swap that file (or the path in `AppLogo`) to
rebrand, since nothing else references it. The same image is the favicon.

### Conventions

- **Imports** always use the `@/` alias, never `../../`.
- **Where code goes**: network calls in `services/`, reusable reactive state in
  `composables/`, shared app state in `stores/`, pure functions in `utils/`, repeated
  strings in `constants/`.
- **`components/ui/*`** take props and emit events. No store access, no network. Anything
  that needs data belongs in `components/<domain>/` or a view.
- **Stores** follow [`example.store.ts`](app/src/stores/example.store.ts): `isLoading` and
  `error` refs, `try / catch / finally`, a normalised error message, rethrow for the caller.
- **Naming**: `AppXxx` for chrome, `BaseXxx` for UI primitives, `XxxView` for routed pages,
  `xxx.store.ts`, `xxx.service.ts`, `useXxx.ts`. No `...Component` suffix.
- **Routes** are declared in `router/routes.ts` with lazy `() => import(...)` so each page
  is its own chunk. Never import views through a barrel file — it defeats code splitting.
  Route names come from `constants/routeNames.ts`.
- **Layouts** are chosen per route with `meta: { layout: "auth" }`; the default is the app
  chrome. `App.vue` is only a layout switch.
- **Tests** live next to what they test as `*.spec.ts`.

### Adding a feature

1. `types/models.ts` — the shape the API returns.
2. `services/thing.service.ts` — the endpoints, typed with that shape.
3. `composables/useThing.ts` or `stores/thing.store.ts` — state, depending on whether it is
   view-local or shared.
4. `components/thing/` — the presentational pieces.
5. `views/ThingView.vue` + an entry in `router/routes.ts` and `constants/routeNames.ts`.

## Deployment

[`app/vercel.json`](app/vercel.json) rewrites all paths to `/` for history-mode routing.
Set the Vercel root directory to `app`.

## TypeScript notes

- **Project references**: `tsconfig.app.json` covers `src`, `tsconfig.node.json` the build
  configs, `tsconfig.vitest.json` the specs. `npm run typecheck` builds all three, and
  `npm run build` runs it before Vite.
- **`strict` plus `noUncheckedIndexedAccess`**, so `array[0]` is `T | undefined` and the
  compiler makes you deal with it.
- **API shapes live in [`types/models.ts`](app/src/types/models.ts)** and flow outwards:
  `api.get<Post[]>` types the service, which types the composable, which types the view.
- **Route meta is typed** in [`types/router.d.ts`](app/src/types/router.d.ts), so a typo in
  `meta` is a compile error and the guard gets autocompletion.
- **`catch (err)` is `unknown`**, so the narrowing lives once in
  [`utils/errors.ts`](app/src/utils/errors.ts) (`apiMessage`, `apiFieldErrors`,
  `isValidationError`) instead of being repeated in every store.
- **TypeScript is pinned to ~5.9**, not 6 or 7: `typescript-eslint` peers `<6.1.0`, so the
  lint toolchain does not support a newer compiler yet.

## Docs

The architecture review that produced this structure lives in the JavaScript template,
[`Vue-template/docs/architecture-review.md`](../Vue-template/docs/architecture-review.md).
