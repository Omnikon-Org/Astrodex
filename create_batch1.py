import json
import subprocess
import time
import sys

# Load existing issue titles to avoid any duplicate ideas
with open("existing_titles.json", "r") as f:
    existing_titles = set(json.load(f))

batch1_issues = [
    {
        "title": "Fix syntax errors and duplicate default export in next.config.ts",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Next.js architecture / Configuration",
        "body": """### Problem
`next.config.ts` currently contains duplicate `export default nextConfig` statements and does not properly wrap the configuration with `@next/bundle-analyzer` or define CSP security headers despite comments indicating so. This prevents proper Next.js configuration parsing and causes build warnings.

### Why it matters
Invalid Next.js configuration syntax can cause unexpected server/client build errors and prevents essential features like bundle size monitoring and security headers from functioning.

### Expected behaviour
`next.config.ts` should have a clean, single export default statement and correctly export the Next.js configuration object with bundle analyzer and CSP support.

### Acceptance criteria
- [ ] Remove duplicate `export default` statements in `next.config.ts`.
- [ ] Ensure `next.config.ts` compiles cleanly with `npm run typecheck` and `npm run build`.
- [ ] Add explicit TypeScript type annotation for `NextConfig`.

### Likely files/components affected
- `next.config.ts`"""
    },
    {
        "title": "Fix division by zero and Infinity returns in visViva orbital speed math",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Orbital Mechanics / Physics",
        "body": """### Problem
The `visViva` and `visVivaKmPerSec` functions in `src/lib/kepler.ts` divide directly by `r` without checking if `r <= 0` or if parameters are invalid/NaN. When `r === 0`, the calculation yields `Infinity` instead of returning `0` or guarding against invalid orbital radii, causing Vitest unit test failures.

### Why it matters
Mathematical division by zero in orbital physics loops can lead to NaN/Infinity rendering coordinates in R3F, crashing instanced mesh matrix calculations.

### Expected behaviour
`visViva` and `visVivaKmPerSec` should validate input parameters (`r <= 0`, `a <= 0`, `rKm <= 0`, or `isNaN`) and safely return `0` when invalid parameters are supplied.

### Acceptance criteria
- [ ] Add explicit boundary checks for `r <= 0` and `a <= 0` in `visViva`.
- [ ] Add explicit boundary checks for `rKm <= 0` and `aKm <= 0` in `visVivaKmPerSec`.
- [ ] Ensure all unit tests in `src/lib/__tests__/kepler.test.ts` pass cleanly without `AssertionError`.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/lib/__tests__/kepler.test.ts`"""
    },
    {
        "title": "Fix unclosed JSX elements and syntax errors in src/app/auth/page.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / React Architecture",
        "body": """### Problem
`src/app/auth/page.tsx` contains malformed JSX syntax, including unclosed `<div>`, `<form>`, and `<label>` tags and misplaced tokens. Running `npm run typecheck` fails with multiple TS17008 and TS1005 errors in this file.

### Why it matters
Syntax errors in App Router pages break the TypeScript compilation pipeline (`npm run typecheck`) and prevent contributors from building the project locally.

### Expected behaviour
`src/app/auth/page.tsx` should have fully valid, semantic JSX markup that compiles without any TypeScript or linter errors.

### Acceptance criteria
- [ ] Fix all unclosed JSX elements (`div`, `form`, `label`) in `src/app/auth/page.tsx`.
- [ ] Correct unexpected tokens and bracket mismatches.
- [ ] Verify `npm run typecheck` passes for `src/app/auth/page.tsx`.

### Likely files/components affected
- `src/app/auth/page.tsx`"""
    },
    {
        "title": "Fix unwrapped adjacent JSX elements in src/components/ClaimButton.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / UI Components",
        "body": """### Problem
`src/components/ClaimButton.tsx` contains adjacent `<path>` tags inside an SVG element that are not properly enclosed in a parent element or React Fragment, causing TypeScript compilation error TS2657.

### Why it matters
Adjacent JSX elements without a wrapping fragment or parent tag violate React JSX specifications and break build checks.

### Expected behaviour
All JSX children inside `src/components/ClaimButton.tsx` should be properly closed and wrapped within valid SVG elements or Fragments.

### Acceptance criteria
- [ ] Wrap adjacent `<path>` elements in `src/components/ClaimButton.tsx` in a parent or fragment.
- [ ] Fix syntax errors on lines 56-61.
- [ ] Ensure `ClaimButton` renders cleanly in tests.

### Likely files/components affected
- `src/components/ClaimButton.tsx`"""
    },
    {
        "title": "Fix unclosed function syntax error at EOF in src/components/earth/textures.ts",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / Canvas 2D Textures",
        "body": """### Problem
`src/components/earth/textures.ts` contains an unclosed function `createProceduralAsteroidNormalMap()` near line 496, leading to an `Expected '}' but found EOF` parse error in TypeScript and Vitest.

### Why it matters
A syntax error in texture generation prevents procedural canvas textures from compiling and breaks unit test execution across 3D components.

### Expected behaviour
`textures.ts` should be syntactically valid with all function blocks and curly braces properly closed.

### Acceptance criteria
- [ ] Close the function block for `createProceduralAsteroidNormalMap` in `src/components/earth/textures.ts`.
- [ ] Ensure procedural texture helper functions export valid Canvas elements.
- [ ] Verify `npm run typecheck` succeeds for `textures.ts`.

### Likely files/components affected
- `src/components/earth/textures.ts`"""
    },
    {
        "title": "Fix syntax errors and invalid keyword typos in src/components/PostProcessing.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / Post-processing",
        "body": """### Problem
`src/components/PostProcessing.tsx` contains broken syntax on lines 25-26 including a typo (`set tings`), missing semicolons, and malformed hook statements.

### Why it matters
Post-processing controls the Bloom and Vignette effects in the R3F canvas. Syntax errors in this component crash the 3D scene pipeline.

### Expected behaviour
`PostProcessing.tsx` should import settings context cleanly and pass Bloom and Vignette parameters to `@react-three/postprocessing` components without syntax errors.

### Acceptance criteria
- [ ] Fix typos and malformed statements in `src/components/PostProcessing.tsx`.
- [ ] Ensure proper TypeScript types for Bloom and Vignette props.
- [ ] Verify component compiles cleanly with `npm run typecheck`.

### Likely files/components affected
- `src/components/PostProcessing.tsx`"""
    },
    {
        "title": "Fix unclosed JSX fragment and syntax errors in src/components/Leaderboard.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / UI Components",
        "body": """### Problem
`src/components/Leaderboard.tsx` fails TypeScript compilation due to unmatched JSX fragments (`<>...</>`) and identifier syntax errors on lines 25, 41, and 61.

### Why it matters
Leaderboard component displays top claimed asteroids and user scores. Broken JSX prevents the component from rendering.

### Expected behaviour
`Leaderboard.tsx` should use valid React JSX markup for table/list layouts and handle empty state cleanly.

### Acceptance criteria
- [ ] Match all opening and closing JSX fragment tags in `src/components/Leaderboard.tsx`.
- [ ] Remove unexpected tokens and fix line 64 parse errors.
- [ ] Verify component passes `npm run typecheck`.

### Likely files/components affected
- `src/components/Leaderboard.tsx`"""
    },
    {
        "title": "Fix syntax errors and unclosed tags in src/components/LoadingSkeleton.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / UI Primitives",
        "body": """### Problem
`src/components/LoadingSkeleton.tsx` contains unclosed `<div>` elements and unexpected token errors (TS17002, TS1382) on lines 53-63.

### Why it matters
Loading skeleton UI provides visual feedback during data fetching. Broken JSX elements crash skeleton fallback renders.

### Expected behaviour
`LoadingSkeleton.tsx` should export a clean skeleton layout component with properly closed DOM tags.

### Acceptance criteria
- [ ] Fix unclosed `<div>` tags and closing parenthesis in `src/components/LoadingSkeleton.tsx`.
- [ ] Ensure skeleton component accepts standard `className` props.
- [ ] Confirm typecheck passes cleanly.

### Likely files/components affected
- `src/components/LoadingSkeleton.tsx`"""
    },
    {
        "title": "Fix malformed JSX tags and syntax errors in src/components/RiskModal.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Accessibility / UI Modals",
        "body": """### Problem
`src/components/RiskModal.tsx` fails TypeScript compilation due to unclosed `<div>` elements on lines 17-33 and misplaced comma/closing brace tokens on lines 45-61.

### Why it matters
The Risk Modal warns users about high-hazard asteroids and orbital conjunction threats. Syntax errors prevent modal display.

### Expected behaviour
`RiskModal.tsx` should render a fully typed modal dialogue with accessible focus management and valid JSX.

### Acceptance criteria
- [ ] Fix unclosed `<div>` tags and bracket mismatches in `src/components/RiskModal.tsx`.
- [ ] Ensure modal toggle handlers are properly typed.
- [ ] Verify `npm run typecheck` passes.

### Likely files/components affected
- `src/components/RiskModal.tsx`"""
    },
    {
        "title": "Fix unclosed HTML elements and syntax errors in src/components/SettingsModal.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / UI Modals",
        "body": """### Problem
`src/components/SettingsModal.tsx` has unclosed `<div>` and `<button>` elements on lines 10, 26, and 98, resulting in TS17008 compilation failures.

### Why it matters
SettingsModal allows users to customize graphics, orbit themes, and audio settings. Compilation errors prevent user configuration updates.

### Expected behaviour
`SettingsModal.tsx` should feature valid JSX markup and clean tab switching logic.

### Acceptance criteria
- [ ] Fix all unclosed `<div>` and `<button>` tags in `src/components/SettingsModal.tsx`.
- [ ] Resolve token errors on lines 103-104.
- [ ] Ensure typecheck succeeds.

### Likely files/components affected
- `src/components/SettingsModal.tsx`"""
    },
    {
        "title": "Fix syntax and statement errors in src/components/Tooltip.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "UI / Components",
        "body": """### Problem
`src/components/Tooltip.tsx` contains statement syntax errors and missing closing braces on lines 37-46.

### Why it matters
Tooltips provide orbital metric definitions for asteroids and satellites. Syntax errors break tooltip overlays across the HUD.

### Expected behaviour
`Tooltip.tsx` should export a reusable, accessible tooltip component that position-binds to target elements.

### Acceptance criteria
- [ ] Fix statement syntax errors and missing braces in `src/components/Tooltip.tsx`.
- [ ] Ensure `Tooltip` component handles hover and focus triggers cleanly.
- [ ] Verify `npm run typecheck` passes.

### Likely files/components affected
- `src/components/Tooltip.tsx`"""
    },
    {
        "title": "Fix syntax error on line 82 in src/components/earth/Atmosphere.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / Shaders",
        "body": """### Problem
`src/components/earth/Atmosphere.tsx` fails TypeScript compilation due to an `Identifier expected` error on line 82.

### Why it matters
Atmosphere component renders Rayleigh scattering rim shaders around Earth. Syntax errors prevent the shader material from instantiating.

### Expected behaviour
`Atmosphere.tsx` should define custom GLSL shaders inside React Three Fiber mesh components without TypeScript errors.

### Acceptance criteria
- [ ] Fix syntax and identifier error on line 82 of `src/components/earth/Atmosphere.tsx`.
- [ ] Ensure R3F shaderMaterial uniforms are properly typed.
- [ ] Verify clean compilation during `npm run typecheck`.

### Likely files/components affected
- `src/components/earth/Atmosphere.tsx`"""
    },
    {
        "title": "Fix syntax errors and statement declarations in src/lib/store.tsx",
        "labels": ["gssoc", "level:intermediate", "type:bug"],
        "category": "State Management / React Context",
        "body": """### Problem
`src/lib/store.tsx` contains TS1128 declaration errors on lines 235 and 277, and token errors on lines 456 and 517.

### Why it matters
`store.tsx` is the central React Context state store for AstroDex (asteroids, camera target, selection, claims, conjunctions). Errors here break state distribution across the entire app.

### Expected behaviour
`AppProvider` and `useAppStore` in `src/lib/store.tsx` should compile cleanly and provide typed state context.

### Acceptance criteria
- [ ] Fix all syntax errors and broken object literals in `src/lib/store.tsx`.
- [ ] Ensure state reducer actions (selectAsteroid, setFilter, claimAsteroid) are properly typed.
- [ ] Verify `npm run typecheck` passes for `store.tsx`.

### Likely files/components affected
- `src/lib/store.tsx`"""
    },
    {
        "title": "Fix statement syntax errors in src/app/layout.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Next.js Architecture",
        "body": """### Problem
`src/app/layout.tsx` contains TS1128 statement declaration errors near lines 80-87, causing root layout build failures.

### Why it matters
The root layout wraps all pages with fonts, metadata, and the global `AppProvider`. Syntax errors prevent Next.js from rendering any routes.

### Expected behaviour
`src/app/layout.tsx` should export a valid RootLayout component wrapping children in html/body elements.

### Acceptance criteria
- [ ] Fix syntax and statement errors in `src/app/layout.tsx`.
- [ ] Ensure Geist and JetBrains Mono fonts load properly via `next/font`.
- [ ] Verify `npm run typecheck` succeeds.

### Likely files/components affected
- `src/app/layout.tsx`"""
    },
    {
        "title": "Exclude E2E Playwright tests from Vitest test runner configuration",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "Testing / CI/CD",
        "body": """### Problem
Running `npm run test` executes Vitest across all test files including `tests/e2e/*.test.ts`. E2E files import `@playwright/test` which fails under Vitest's JSDOM environment with module resolution errors.

### Why it matters
Mixing Playwright E2E tests into Vitest unit test runs causes false positive CI test failures.

### Expected behaviour
Vitest should only execute unit and integration test files (`src/**/*.test.ts(x)` and `tests/unit/**/*.test.ts(x)`), excluding E2E test patterns.

### Acceptance criteria
- [ ] Update `exclude` in `vitest.config.ts` to ignore `tests/e2e/**` and `**/*.e2e.ts`.
- [ ] Ensure `npm run test` runs unit test suites cleanly without Playwright import errors.

### Likely files/components affected
- `vitest.config.ts`"""
    },
    {
        "title": "Implement real unit test suite for Kepler orbital mechanics in kepler.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Orbital Mechanics",
        "body": """### Problem
The test file `tests/kepler.test.ts` is an empty stub containing only comment lines. Keplerian math (`solveKepler`, `meanMotion`, `visViva`, `hohmannDeltaVKmPerSec`) requires thorough test assertions.

### Why it matters
Keplerian orbital mechanics is the mathematical core of AstroDex. Without unit tests, regressions in orbit calculations go unnoticed.

### Expected behaviour
`tests/kepler.test.ts` should contain assertions testing `solveKepler` convergence, eccentric anomaly calculations, Vis-Viva speed conversions, and Hohmann transfer delta-V accuracy.

### Acceptance criteria
- [ ] Implement unit tests verifying `solveKepler` for circular ($e=0$) and elliptical ($e=0.5$) orbits.
- [ ] Implement unit tests verifying `meanMotion` and `visVivaKmPerSec` for LEO and GEO altitudes.
- [ ] Implement unit tests for `hohmannDeltaVKmPerSec`.
- [ ] Ensure all tests pass with `npm run test`.

### Likely files/components affected
- `tests/kepler.test.ts`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement unit test suite for CameraController tracking logic",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / 3D Navigation",
        "body": """### Problem
`src/components/CameraController.tsx` manages lerping camera positions towards selected orbital targets, but currently lacks automated unit tests.

### Why it matters
Camera tracking is central to object inspection. Untested camera logic can lead to camera locking or jitter during target transitions.

### Expected behaviour
Camera controller logic should have unit tests verifying camera target calculation, smooth lerp step computation, and default reset position behavior.

### Acceptance criteria
- [ ] Write unit tests for camera position target calculations when selecting asteroids.
- [ ] Test reset camera position action.
- [ ] Ensure test coverage reports execute cleanly in Vitest.

### Likely files/components affected
- `src/components/__tests__/CameraController.test.ts`
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Implement unit test suite for AsteroidField instancing matrix math",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / 3D Instancing",
        "body": """### Problem
`src/components/__tests__/AsteroidField.test.tsx` contains only 1 basic test. `AsteroidField` manages `InstancedMesh` matrix and color buffers for 600+ asteroids.

### Why it matters
Instanced mesh matrix math determines asteroid spatial positioning. Comprehensive unit tests ensure orbital data updates correctly modify `setMatrixAt`.

### Expected behaviour
Unit tests should verify orbital object dataset generation, matrix transformation logic, and color updating based on selection/claim state.

### Acceptance criteria
- [ ] Add tests for `generateOrbitalObjectData` verifying orbital parameter outputs $(a, e, M_0)$.
- [ ] Add tests for selection color highlighting in `setColorAt`.
- [ ] Verify all tests pass in Vitest.

### Likely files/components affected
- `src/components/__tests__/AsteroidField.test.tsx`
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Write unit tests for SatelliteSystem orbital decay calculations",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Physics Simulation",
        "body": """### Problem
`SatelliteSystem.tsx` simulates Low Earth Orbit (LEO) altitude decay for active satellites like ISS, but lacks dedicated unit tests for decay floor limits.

### Why it matters
Unchecked decay math could allow satellite orbits to collapse below Earth's radius (negative altitude).

### Expected behaviour
Unit tests should verify that altitude decay steps diminish orbit semi-major axis down to the minimum safety altitude floor (100 km) and trigger decay warning states.

### Acceptance criteria
- [ ] Write unit tests for LEO orbital decay step function.
- [ ] Verify altitude decay stops at safety floor threshold.
- [ ] Verify test suite runs in `npm run test`.

### Likely files/components affected
- `src/components/SatelliteSystem.tsx`
- `tests/unit/SatelliteSystem.test.ts`"""
    },
    {
        "title": "Write unit tests for AgentTerminal log filtering and formatting",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / UI Components",
        "body": """### Problem
`AgentTerminal.tsx` displays telemetry logs, conjunction alerts, and sensor sweeps, but has no unit test coverage.

### Why it matters
Terminal logs provide situational awareness. Testing ensures log filtering (All, Conjunctions, Sweeps) and log entry formatting remain reliable.

### Expected behaviour
Unit tests should verify log message appending, category filtering, clear terminal action, and log export formatting.

### Acceptance criteria
- [ ] Write unit tests for log state filtering in `AgentTerminal`.
- [ ] Test log clearing and JSON export helper functions.
- [ ] Ensure tests pass in Vitest.

### Likely files/components affected
- `src/components/AgentTerminal.tsx`
- `tests/terminal.test.ts`"""
    },
    {
        "title": "Implement unit tests for AppProvider context reducers in src/lib/store.tsx",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / State Management",
        "body": """### Problem
`src/lib/store.tsx` contains global state logic for selected objects, orbital catalog filters, active satellite claims, and conjunction alerts, but lacks unit tests for state reducers.

### Why it matters
React Context reducer bugs can break UI interactions globally. Unit testing state mutations prevents state regression bugs.

### Expected behaviour
A dedicated test suite should exercise `AppProvider` actions: selecting an asteroid, filtering by orbit class, claiming an object, and clearing selections.

### Acceptance criteria
- [ ] Write unit tests for `selectObject`, `setFilter`, `claimAsteroid`, and `toggleSimPause` actions.
- [ ] Test initial state defaults.
- [ ] Ensure 100% pass rate in Vitest.

### Likely files/components affected
- `src/lib/store.tsx`
- `tests/store.test.ts`"""
    },
    {
        "title": "Implement Content Security Policy (CSP) security headers in next.config.ts",
        "labels": ["gssoc", "level:intermediate", "type:security"],
        "category": "Security / Next.js Configuration",
        "body": """### Problem
AstroDex currently lacks Content Security Policy (CSP) and HTTP security headers in `next.config.ts`, leaving the web application vulnerable to Cross-Site Scripting (XSS) and clickjacking.

### Why it matters
Security headers like `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` are critical for hardening Next.js applications against injection attacks.

### Expected behaviour
`next.config.ts` should define secure HTTP headers using Next.js `headers()` configuration.

### Acceptance criteria
- [ ] Configure strict `headers()` array in `next.config.ts`.
- [ ] Include `Content-Security-Policy` permitting WebGL inline scripts and canvas textures.
- [ ] Add `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff`.
- [ ] Verify headers build without breaking Next.js App Router.

### Likely files/components affected
- `next.config.ts`"""
    },
    {
        "title": "Add runtime environment variable validation script for Supabase keys",
        "labels": ["gssoc", "level:beginner", "type:security"],
        "category": "Security / Backend Integration",
        "body": """### Problem
If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing or invalid, Supabase client initialization fails silently or throws cryptic runtime errors during API calls.

### Why it matters
Validating environment variables at startup prevents unexpected crashes in production and gives developers instant setup feedback.

### Expected behaviour
A runtime schema validator (e.g. using `envValidation.ts`) should check for required Supabase environment variables on app initialization and log clear warning messages if missing.

### Acceptance criteria
- [ ] Implement `validateEnv()` in `src/lib/envValidation.ts`.
- [ ] Check format of `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Fall back gracefully to mock storage mode when env vars are absent.

### Likely files/components affected
- `src/lib/envValidation.ts`
- `src/lib/supabaseClient.ts`"""
    },
    {
        "title": "Implement client-side rate limiting and debouncing for mining claim submissions",
        "labels": ["gssoc", "level:intermediate", "type:security"],
        "category": "Security / UI Controls",
        "body": """### Problem
The mining claim submission in `ClaimButton.tsx` and `store.tsx` lacks rate-limiting or debounce protection. Rapidly clicking the button fires multiple concurrent requests to the backend/state.

### Why it matters
Unthrottled user requests can overwhelm database handlers and create duplicate claim logs in Supabase.

### Expected behaviour
Claim submissions should be debounced and rate-limited to a maximum of 1 request per 2 seconds per user session.

### Acceptance criteria
- [ ] Add a cooldown timer / disabled state to `ClaimButton.tsx` during submission.
- [ ] Implement rate-limiting guard in `src/lib/rateLimit.ts` for claim submissions.
- [ ] Display a toast message if user submits claims too rapidly.

### Likely files/components affected
- `src/components/ClaimButton.tsx`
- `src/lib/rateLimit.ts`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Enforce strict Row Level Security (RLS) policies for claims in supabase.sql",
        "labels": ["gssoc", "level:intermediate", "type:security"],
        "category": "Backend / Database Security",
        "body": """### Problem
`supabase.sql` defines basic table structures for asteroid claims, but lacks granular Row Level Security (RLS) policies enforcing user ownership on insert, update, and delete actions.

### Why it matters
Without RLS policies, any unauthenticated client could potentially overwrite or delete asteroid claims owned by other users.

### Expected behaviour
`supabase.sql` should enable RLS on the `claims` table and restrict `INSERT`/`UPDATE`/`DELETE` operations so users can only manage claims matching their `auth.uid()`.

### Acceptance criteria
- [ ] Add `ALTER TABLE claims ENABLE ROW LEVEL SECURITY;` to `supabase.sql`.
- [ ] Create policy allowing public `SELECT` access to all claims.
- [ ] Create policy restricting `INSERT` and `UPDATE` to authenticated owners (`auth.uid() = user_id`).

### Likely files/components affected
- `supabase.sql`
- `supabase/migrations/`"""
    },
    {
        "title": "Implement ARIA live region announcements for orbital conjunction warnings",
        "labels": ["gssoc", "level:intermediate", "type:accessibility"],
        "category": "Accessibility / Screen Readers",
        "body": """### Problem
When the real-time conjunction detector in `src/lib/conjunction.ts` identifies a dangerous close-approach event, alerts are displayed visually in LeftSidebar but are not announced to screen reader users.

### Why it matters
Visually impaired users relying on screen readers miss critical real-time mission control events and danger warnings.

### Expected behaviour
Conjunction warnings should trigger polite ARIA live region announcements using an `aria-live=\"polite\"` container or central announcer helper.

### Acceptance criteria
- [ ] Add an `aria-live=\"polite\"` notification region in `LeftSidebar.tsx` or HUD overlay.
- [ ] Invoke `announce()` in `src/lib/announce.ts` when a new conjunction risk level reaches HIGH or CRITICAL.
- [ ] Test accessibility with screen reader tools.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/lib/announce.ts`
- `src/lib/conjunction.ts`"""
    },
    {
        "title": "Implement ARIA live region announcements for satellite orbital decay warnings",
        "labels": ["gssoc", "level:intermediate", "type:accessibility"],
        "category": "Accessibility / HUD Telemetry",
        "body": """### Problem
LEO satellite altitude decay alerts in `SatelliteSystem.tsx` update visual meters in the HUD but do not communicate health degradation to assistive technology.

### Why it matters
Users with low vision or screen readers cannot perceive visual badge changes when a satellite orbit decays near re-entry thresholds.

### Expected behaviour
Orbital decay warnings (e.g. altitude falling below 200 km) should be announced via an `aria-live=\"assertive\"` region.

### Acceptance criteria
- [ ] Add `role=\"status\"` and `aria-live=\"assertive\"` to orbital decay alert badges.
- [ ] Dispatch accessible text updates when satellite altitude drops below safe limits.
- [ ] Ensure announcements do not flood the screen reader queue.

### Likely files/components affected
- `src/components/SatelliteSystem.tsx`
- `src/components/DecayChart.tsx`"""
    },
    {
        "title": "Implement focus trapping and focus restoration for HUD modal dialogs",
        "labels": ["gssoc", "level:intermediate", "type:accessibility"],
        "category": "Accessibility / Keyboard Navigation",
        "body": """### Problem
When opening HUD modals (`SettingsModal.tsx`, `ProfileModal.tsx`, `RiskModal.tsx`), pressing the `Tab` key moves focus onto background canvas controls and hidden sidebar buttons rather than trapping focus inside the active modal.

### Why it matters
Focus escaping modal boundaries makes keyboard navigation confusing and breaks WCAG 2.1 modal accessibility guidelines.

### Expected behaviour
Modals should utilize `react-focus-lock` to constrain focus within the modal container while open, and restore focus to the triggering element upon closing.

### Acceptance criteria
- [ ] Wrap modal content in `SettingsModal.tsx`, `ProfileModal.tsx`, and `RiskModal.tsx` with `FocusLock`.
- [ ] Restore focus to the trigger button when closing a modal via Escape key or close button.
- [ ] Ensure `Escape` key closes all active HUD modals.

### Likely files/components affected
- `src/components/SettingsModal.tsx`
- `src/components/ProfileModal.tsx`
- `src/components/RiskModal.tsx`"""
    },
    {
        "title": "Add keyboard navigable 3D reticle selection for AsteroidField instanced mesh",
        "labels": ["gssoc", "level:advanced", "type:accessibility"],
        "category": "Accessibility / 3D Navigation",
        "body": """### Problem
Currently, selecting asteroids in the 3D scene requires mouse clicks on instanced mesh geometries. Keyboard-only users cannot select orbital objects directly within the 3D viewport.

### Why it matters
3D graphics applications must provide alternative keyboard mechanisms to ensure full accessibility for users with mobility impairments.

### Expected behaviour
Keyboard users should be able to cycle through near-Earth asteroids using `[` and `]` or Arrow keys, moving a target reticle in 3D space to focus and inspect the selected object.

### Acceptance criteria
- [ ] Implement keyboard navigation shortcut listener in `KeyboardNavigation.tsx`.
- [ ] Cycle through visible orbital catalog objects sequentially on keyboard keypress.
- [ ] Update selected object target state in `store.tsx` and trigger camera lerp.

### Likely files/components affected
- `src/components/KeyboardNavigation.tsx`
- `src/components/AsteroidField.tsx`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Add fallback screen reader text description for R3F 3D Canvas element",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / HTML Semantics",
        "body": """### Problem
The 3D WebGL `<Canvas>` rendered by React Three Fiber in `Scene.tsx` lacks alternative text descriptions or fallback semantic content for screen readers.

### Why it matters
Screen readers encounter an opaque canvas element without knowing what spatial simulation or interactive scene is being displayed.

### Expected behaviour
The Canvas container should include an accessible text fallback describing the 3D mission control simulation and providing links to sidebar telemetry tables.

### Acceptance criteria
- [ ] Add `aria-label=\"Interactive 3D Earth and Asteroid Orbit Simulation\"` to the Canvas container.
- [ ] Include an off-screen fallback summary element describing active orbital counts.
- [ ] Ensure screen reader audit tools recognize canvas context.

### Likely files/components affected
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Debounce catalog search input in src/components/LeftSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:performance"],
        "category": "Performance / UI Optimization",
        "body": """### Problem
In `LeftSidebar.tsx`, entering query text into the catalog search field updates local state immediately, re-filtering the list of 600+ orbital objects on every single character input.

### Why it matters
Executing un-debounced array filtering across 600+ items on every keystroke causes input lag and UI frame drops on mobile devices.

### Expected behaviour
The search query state should be debounced by 250ms so filtering only executes after the user pauses typing.

### Acceptance criteria
- [ ] Implement a debounced search handler in `LeftSidebar.tsx` using a custom `useDebounce` hook or `setTimeout`.
- [ ] Verify catalog filtering executes cleanly without UI stutter during fast typing.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/hooks/useDebounce.ts`"""
    },
    {
        "title": "Migrate residual custom CSS files (Auth.css, ClaimButton.css) to Tailwind v4 utility classes",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Styling System",
        "body": """### Problem
`src/components/Auth.css` and `src/components/ClaimButton.css` contain standalone custom CSS rules that duplicate styling tokens and bypass Tailwind CSS v4.

### Why it matters
Maintaining isolated CSS files alongside Tailwind CSS v4 increases CSS bundle size and leads to style fragmentation.

### Expected behaviour
All custom styles in `Auth.css` and `ClaimButton.css` should be refactored into inline Tailwind CSS v4 utility classes within their respective TSX components.

### Acceptance criteria
- [ ] Convert CSS rules in `Auth.css` and `ClaimButton.css` to Tailwind v4 class names.
- [ ] Remove `Auth.css` and `ClaimButton.css` files.
- [ ] Ensure visual styling of authentication and claim buttons remains identical.

### Likely files/components affected
- `src/components/Auth.css`
- `src/components/ClaimButton.css`
- `src/components/Auth.tsx`
- `src/components/ClaimButton.tsx`"""
    },
    {
        "title": "Migrate LoadingSkeleton.css and Notifications.css to Tailwind v4 utility classes",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Styling System",
        "body": """### Problem
`src/components/LoadingSkeleton.css` and `src/components/Notifications.css` rely on traditional CSS stylesheets rather than Tailwind CSS v4 design tokens.

### Why it matters
Consolidating styles into Tailwind utility classes ensures consistent theme variable usage (glassmorphism, dark palette) and simplifies maintenance.

### Expected behaviour
Replace external CSS imports in `LoadingSkeleton.tsx` and toast notification components with inline Tailwind v4 classes.

### Acceptance criteria
- [ ] Refactor CSS rules in `LoadingSkeleton.css` and `Notifications.css` into Tailwind v4 classes.
- [ ] Delete `LoadingSkeleton.css` and `Notifications.css`.
- [ ] Verify loading pulse and notification toast animations work seamlessly.

### Likely files/components affected
- `src/components/LoadingSkeleton.css`
- `src/components/Notifications.css`
- `src/components/LoadingSkeleton.tsx`
- `src/components/Toasts.tsx`"""
    },
    {
        "title": "Migrate RightSidebar.css to Tailwind v4 theme utility classes",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Styling System",
        "body": """### Problem
`src/components/RightSidebar.css` contains 471 bytes of raw CSS declarations including fixed pixel widths and custom color values.

### Why it matters
Hardcoded CSS values prevent the RightSidebar from adapting cleanly to custom theme modes and responsive viewport sizes.

### Expected behaviour
`RightSidebar.css` styles should be converted into Tailwind v4 utility classes and CSS custom property tokens.

### Acceptance criteria
- [ ] Refactor all declarations in `RightSidebar.css` into Tailwind v4 utility classes in `RightSidebar.tsx`.
- [ ] Remove `RightSidebar.css`.
- [ ] Ensure inspector telemetry panel layout remains responsive.

### Likely files/components affected
- `src/components/RightSidebar.css`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Refactor Earth shader code in src/components/earth/Earth.tsx into standalone material constants",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Refactoring / Shader Architecture",
        "body": """### Problem
The GLSL vertex and fragment shader source codes in `src/components/earth/Earth.tsx` are defined as long template literals inside component files, making Earth render logic hard to read and maintain.

### Why it matters
Inlining multi-hundred line shader GLSL strings directly inside React component files clutter JSX logic and impede syntax highlighting.

### Expected behaviour
GLSL shader strings should be extracted into a dedicated `earthShaders.ts` module exporting typed vertex and fragment shader constants.

### Acceptance criteria
- [ ] Create `src/components/earth/earthShaders.ts`.
- [ ] Move `vertexShader` and `fragmentShader` template literals into `earthShaders.ts`.
- [ ] Import shader constants in `Earth.tsx` and ensure R3F Earth mesh renders unchanged.

### Likely files/components affected
- `src/components/earth/Earth.tsx`
- `src/components/earth/earthShaders.ts`"""
    },
    {
        "title": "Refactor GLSL code in Atmosphere.tsx and CloudLayer.tsx into separate shader material modules",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Refactoring / Shader Architecture",
        "body": """### Problem
GLSL shader source strings for atmospheric scattering (`Atmosphere.tsx`) and cloud noise blending (`CloudLayer.tsx`) are mixed directly into component render files.

### Why it matters
Separating shader code from React component structures improves modularity, testability, and code readability.

### Expected behaviour
Atmosphere and CloudLayer GLSL shaders should be relocated to dedicated material modules under `src/components/earth/shaders/`.

### Acceptance criteria
- [ ] Extract Atmosphere shaders into `atmosphereShaders.ts`.
- [ ] Extract CloudLayer shaders into `cloudShaders.ts`.
- [ ] Import shaders in `Atmosphere.tsx` and `CloudLayer.tsx`.
- [ ] Verify Earth atmosphere and cloud rendering remain visually accurate.

### Likely files/components affected
- `src/components/earth/Atmosphere.tsx`
- `src/components/earth/CloudLayer.tsx`
- `src/components/earth/shaders/`"""
    },
    {
        "title": "Reuse module-level scratch THREE.Vector3 objects in SatelliteSystem useFrame loop",
        "labels": ["gssoc", "level:intermediate", "type:performance"],
        "category": "Performance / GC Memory Optimization",
        "body": """### Problem
`SatelliteSystem.tsx` computes satellite orbit position matrices per frame in `useFrame`, instantiating new temporary `THREE.Vector3` objects inside the animation loop.

### Why it matters
Creating new `THREE.Vector3` objects on every frame (60 fps) causes frequent garbage collection pauses, producing noticeable micro-stutter in 3D rendering.

### Expected behaviour
`SatelliteSystem.tsx` should declare module-level scratch `THREE.Vector3`, `THREE.Quaternion`, and `THREE.Matrix4` instances reused across `useFrame` iterations.

### Acceptance criteria
- [ ] Define scratch instances (`tempVec`, `tempQuat`, `tempMatrix`) outside component render loop.
- [ ] Update `useFrame` in `SatelliteSystem.tsx` to set values on scratch objects without calling `new THREE.Vector3()`.
- [ ] Confirm smooth 60 fps rendering without memory allocation spikes.

### Likely files/components affected
- `src/components/SatelliteSystem.tsx`"""
    },
    {
        "title": "Implement frustum culling for AsteroidField instanced mesh instances",
        "labels": ["gssoc", "level:advanced", "type:performance"],
        "category": "Performance / WebGL Rendering",
        "body": """### Problem
`AsteroidField.tsx` updates matrix transformations for all 600 instanced asteroids every frame, regardless of whether they fall inside or outside the active camera view frustum.

### Why it matters
Performing matrix calculations and draw updates for off-screen asteroids consumes GPU/CPU cycles unnecessarily on low-power devices.

### Expected behaviour
`AsteroidField.tsx` should test instance positions against camera frustum bounds in `useFrame` or skip scale matrix updates for off-screen objects.

### Acceptance criteria
- [ ] Construct a module-level `THREE.Frustum` and `THREE.Matrix4` in `AsteroidField.tsx`.
- [ ] Update frustum bounds from `camera.projectionMatrix` in `useFrame`.
- [ ] Skip matrix transformations for instances positioned outside the frustum.
- [ ] Verify framerate improvement during zoomed-in views.

### Likely files/components affected
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Integrate @next/bundle-analyzer into next.config.ts configuration",
        "labels": ["gssoc", "level:beginner", "type:performance"],
        "category": "Performance / Build Tooling",
        "body": """### Problem
`package.json` includes `"analyze": "ANALYZE=true next build"` and devDependency `@next/bundle-analyzer`, but `next.config.ts` does not wrap the configuration with `withBundleAnalyzer`.

### Why it matters
Without bundle analyzer integration in `next.config.ts`, running `npm run analyze` fails to launch the interactive bundle breakdown tool.

### Expected behaviour
`next.config.ts` should conditionally wrap `nextConfig` with `@next/bundle-analyzer` when `process.env.ANALYZE === 'true'`.

### Acceptance criteria
- [ ] Import `@next/bundle-analyzer` in `next.config.ts`.
- [ ] Wrap `nextConfig` with `withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })`.
- [ ] Verify running `npm run analyze` builds and opens client/server bundle HTML reports.

### Likely files/components affected
- `next.config.ts`
- `package.json`"""
    },
    {
        "title": "Configure GitHub Actions workflow for automated PR title linting",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / CI Automation",
        "body": """### Problem
`.github/workflows/pr-title-lint.yml` is an incomplete 78-byte placeholder file. AstroDex requires Conventional Commit titles for automated release notes.

### Why it matters
Without automated PR title enforcement, contributors may submit non-standard PR titles (`feat`, `fix`, `docs`), breaking semantic versioning scripts.

### Expected behaviour
`pr-title-lint.yml` should run a GitHub Action (e.g. `amannn/action-semantic-pull-request`) on all pull requests checking for valid Conventional Commit prefixes.

### Acceptance criteria
- [ ] Update `.github/workflows/pr-title-lint.yml` with a valid workflow definition.
- [ ] Trigger on `pull_request` types `[opened, edited, synchronize]`.
- [ ] Validate title prefixes (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`).

### Likely files/components affected
- `.github/workflows/pr-title-lint.yml`"""
    },
    {
        "title": "Configure Dependabot automated security dependency update workflow",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Security Automation",
        "body": """### Problem
The repository lacks a `.github/dependabot.yml` configuration file to automate security patches and dependency updates for npm packages and GitHub Actions.

### Why it matters
Automated dependency scanning ensures out-of-date or vulnerable packages in `package.json` are flagged and patched automatically.

### Expected behaviour
A `.github/dependabot.yml` file should be created to check npm and GitHub Actions dependencies weekly.

### Acceptance criteria
- [ ] Create `.github/dependabot.yml`.
- [ ] Configure `package-ecosystem: "npm"` with weekly interval checks.
- [ ] Configure `package-ecosystem: "github-actions"` with weekly updates.

### Likely files/components affected
- `.github/dependabot.yml`"""
    },
    {
        "title": "Configure automated bundle size check step in GitHub Actions CI pipeline",
        "labels": ["gssoc", "level:intermediate", "type:ci"],
        "category": "DevOps / CI Automation",
        "body": """### Problem
`.github/workflows/bundle-size.yml` is a 59-byte placeholder file that does not execute bundle size comparisons on pull requests.

### Why it matters
Large Three.js or Next.js dependency additions can unknowingly bloat client bundle sizes. CI bundle checks prevent performance regressions.

### Expected behaviour
`bundle-size.yml` should build Next.js on every PR and post a bundle size summary comment comparing against `main`.

### Acceptance criteria
- [ ] Populate `.github/workflows/bundle-size.yml` with a valid GitHub Actions workflow.
- [ ] Run Next.js build and measure `.next/static` output size.
- [ ] Fail or comment if bundle size increases beyond threshold.

### Likely files/components affected
- `.github/workflows/bundle-size.yml`"""
    },
    {
        "title": "Implement automated Lighthouse CI performance audit workflow",
        "labels": ["gssoc", "level:intermediate", "type:ci"],
        "category": "DevOps / Performance Audit",
        "body": """### Problem
`.github/workflows/lighthouse-ci.yml` is an empty 51-byte placeholder file.

### Why it matters
Automated Lighthouse CI audits measure Performance, Accessibility, Best Practices, and SEO metrics on every pull request before merging.

### Expected behaviour
`lighthouse-ci.yml` should build the application and run `@lhci/cli` audits against local preview builds.

### Acceptance criteria
- [ ] Configure `.github/workflows/lighthouse-ci.yml` using `treosh/lighthouse-ci-action`.
- [ ] Assert minimum score thresholds (e.g. Accessibility >= 90, SEO >= 90).
- [ ] Report audit results in PR status checks.

### Likely files/components affected
- `.github/workflows/lighthouse-ci.yml`
- `lighthouserc.json`"""
    },
    {
        "title": "Implement automated npm security vulnerability audit workflow in GitHub Actions",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Security CI",
        "body": """### Problem
`.github/workflows/npm-audit.yml` is a 79-byte stub file that does not perform automated security checks on node packages.

### Why it matters
Dependencies can introduce known high or critical CVE vulnerabilities. Automated npm audit workflows block insecure pull requests.

### Expected behaviour
`npm-audit.yml` should execute `npm audit --audit-level=high` on pull requests targeting `main`.

### Acceptance criteria
- [ ] Update `.github/workflows/npm-audit.yml` with a complete GitHub Actions definition.
- [ ] Run `npm audit` on `pull_request` triggers.
- [ ] Fail build if high/critical severity security vulnerabilities are detected.

### Likely files/components affected
- `.github/workflows/npm-audit.yml`"""
    },
    {
        "title": "Implement Vercel preview deployment workflow in vercel-preview.yml",
        "labels": ["gssoc", "level:intermediate", "type:ci"],
        "category": "DevOps / CI/CD Pipelines",
        "body": """### Problem
`.github/workflows/vercel-preview.yml` is a 58-byte placeholder file without deployment build rules.

### Why it matters
Automated preview deployments allow maintainers and GSSoC reviewers to test live UI features on Vercel preview links before merging.

### Expected behaviour
`vercel-preview.yml` should trigger Vercel CLI deployments on PR branch updates and comment with the preview deployment URL.

### Acceptance criteria
- [ ] Configure `.github/workflows/vercel-preview.yml` using official Vercel GitHub Action.
- [ ] Set up preview deployment triggers for PRs targeting `main`.
- [ ] Include secret environment variable references for Vercel tokens.

### Likely files/components affected
- `.github/workflows/vercel-preview.yml`"""
    },
    {
        "title": "Complete missing architecture specification in docs/architecture.md",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / Architecture",
        "body": """### Problem
`docs/architecture.md` is an 86-byte stub file containing no architectural overview, state flow diagrams, or component breakdown.

### Why it matters
New GSSoC contributors need documentation explaining how React Context (`store.tsx`), R3F Scene (`Scene.tsx`), and Kepler orbital physics (`kepler.ts`) interact.

### Expected behaviour
`docs/architecture.md` should provide a comprehensive architectural document covering application layers, state management, 3D WebGL rendering, and orbital mechanics.

### Acceptance criteria
- [ ] Document project architecture layers in `docs/architecture.md`.
- [ ] Add ASCII or Mermaid diagrams illustrating state bridge between React HUD and R3F Canvas.
- [ ] Document Kepler physics units and time scale parameters.

### Likely files/components affected
- `docs/architecture.md`"""
    },
    {
        "title": "Complete missing custom satellite guide in docs/custom-satellites.md",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / Guides",
        "body": """### Problem
`docs/custom-satellites.md` is a 91-byte placeholder file missing instructions on how to add new satellite models and Keplerian orbits.

### Why it matters
Contributors often want to add new satellites (e.g. James Webb, Tiangong). Without documentation, they struggle to configure orbital elements correctly.

### Expected behaviour
`docs/custom-satellites.md` should present a step-by-step guide on defining satellite parameters $(a, e, i, \Omega, M_0)$ and rendering 3D geometries.

### Acceptance criteria
- [ ] Create detailed satellite setup guide in `docs/custom-satellites.md`.
- [ ] Provide example code for registering a satellite in `SatelliteSystem.tsx`.
- [ ] Include parameter reference table for orbital elements.

### Likely files/components affected
- `docs/custom-satellites.md`"""
    },
    {
        "title": "Complete internationalization guide in docs/i18n-guide.md",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / i18n",
        "body": """### Problem
`docs/i18n-guide.md` is a 61-byte empty file that provides no guidelines on adding multi-language support to the HUD overlay.

### Why it matters
Preparing AstroDex for internationalization requires standard guidelines on extracting hardcoded UI strings into translation files.

### Expected behaviour
`docs/i18n-guide.md` should outline the strategy for internationalization (e.g. `next-intl`), string dictionary keys, and translation contribution rules.

### Acceptance criteria
- [ ] Document i18n architectural plan in `docs/i18n-guide.md`.
- [ ] List HUD components needing string extraction.
- [ ] Include code snippets demonstrating localized string usage in Next.js App Router.

### Likely files/components affected
- `docs/i18n-guide.md`"""
    },
    {
        "title": "Create OpenAPI specification for AstroDex backend services in docs/openapi.yaml",
        "labels": ["gssoc", "level:intermediate", "type:documentation"],
        "category": "Documentation / API Spec",
        "body": """### Problem
`docs/openapi.yaml` is a 44-byte stub file lacking OpenAPI 3.0 schemas for API routes and Supabase endpoints.

### Why it matters
A structured OpenAPI specification enables API documentation generators and allows developers to inspect request/response contracts for asteroid claims and conjunction feeds.

### Expected behaviour
`docs/openapi.yaml` should define OpenAPI 3.0.3 endpoints for `/api/asteroids`, `/api/conjunctions`, and `/api/claims`.

### Acceptance criteria
- [ ] Write valid OpenAPI 3.0.3 YAML schema in `docs/openapi.yaml`.
- [ ] Document request/response models for asteroid data objects.
- [ ] Validate schema syntax using standard OpenAPI linting.

### Likely files/components affected
- `docs/openapi.yaml`"""
    },
    {
        "title": "Complete Supabase setup guide in docs/SUPABASE_SETUP.md",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / Backend Setup",
        "body": """### Problem
`docs/SUPABASE_SETUP.md` is a 74-byte stub missing setup instructions for local Supabase development and production environment configuration.

### Why it matters
Contributors working on mining claims or authentication need step-by-step documentation for running Supabase CLI locally and applying database migrations.

### Expected behaviour
`docs/SUPABASE_SETUP.md` should guide developers through Supabase CLI initialization, applying `supabase.sql`, and configuring environment variables.

### Acceptance criteria
- [ ] Document Supabase setup steps in `docs/SUPABASE_SETUP.md`.
- [ ] Include SQL migration execution commands and RLS policy setup instructions.
- [ ] Provide troubleshooting notes for local Supabase connection issues.

### Likely files/components affected
- `docs/SUPABASE_SETUP.md`"""
    }
]

print(f"Total proposed Batch 1 issues: {len(batch1_issues)}")

# Verify all titles are unique and non-duplicate
created_count = 0
dup_count = 0
for idx, issue in enumerate(batch1_issues, 1):
    t_lower = issue["title"].lower()
    if t_lower in existing_titles:
        print(f"Skipping duplicate issue: {issue['title']}")
        dup_count += 1
        continue
    
    # Run gh issue create
    cmd = [
        "gh", "issue", "create",
        "--title", issue["title"],
        "--body", issue["body"],
    ]
    for lbl in issue["labels"]:
        cmd.extend(["--label", lbl])
    
    print(f"[{idx}/50] Creating issue: {issue['title']} (Labels: {issue['labels']})")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        created_count += 1
        existing_titles.add(t_lower)
        print(f"  -> Created successfully: {res.stdout.strip()}")
    else:
        print(f"  -> Failed: {res.stderr.strip()}")
    time.sleep(0.5)

print(f"\nBatch 1 Summary: Created {created_count} issues. Skipped {dup_count} duplicates.")
