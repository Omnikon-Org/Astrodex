import json
import subprocess
import time
import sys

with open("existing_titles.json", "r") as f:
    existing_titles = set(json.load(f))

batch3_issues = [
    {
        "title": "Implement global search modal with fuzzy search overlay in src/components/SearchModal.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "UI / Global Search",
        "body": """### Problem
`SearchModal.tsx` is a 67-byte stub file. AstroDex lacks a global command palette search modal (`Cmd+K` / `Ctrl+K`) allowing users to quickly search asteroids, satellites, and HUD controls.

### Why it matters
A command palette search interface dramatically speeds up navigation across 600+ orbital objects and mission control panels.

### Expected behaviour
Pressing `Cmd+K` or `Ctrl+K` opens `SearchModal.tsx` with fuzzy search across asteroids, satellites, and settings shortcuts.

### Acceptance criteria
- [ ] Implement command palette modal dialogue in `src/components/SearchModal.tsx`.
- [ ] Bind shortcut listener (`Cmd+K`) to toggle search overlay.
- [ ] Provide keyboard navigation (Arrow Up/Down, Enter to select).

### Likely files/components affected
- `src/components/SearchModal.tsx`
- `src/components/KeyboardManager.tsx`"""
    },
    {
        "title": "Implement keyboard shortcuts help modal in src/components/ShortcutsModal.tsx",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / Help Modals",
        "body": """### Problem
`ShortcutsModal.tsx` is a 53-byte stub. Users pressing `?` key have no visual guide listing available keyboard navigation shortcuts.

### Why it matters
Providing a keyboard shortcut reference modal improves accessibility and discoverability for keyboard-only users.

### Expected behaviour
Pressing `?` key opens `ShortcutsModal.tsx` presenting a clean table of all HUD keyboard shortcuts (`Space`, `R`, `F`, `Cmd+K`, `?`).

### Acceptance criteria
- [ ] Implement `ShortcutsModal.tsx` modal layout with accessible dialog role.
- [ ] Bind `?` keydown event to open modal.
- [ ] Include close button and ESC dismissal handler.

### Likely files/components affected
- `src/components/ShortcutsModal.tsx`
- `src/components/KeyboardManager.tsx`"""
    },
    {
        "title": "Implement interactive onboarding tour for first-time users in src/components/Onboarding.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / User Onboarding",
        "body": """### Problem
`Onboarding.tsx` is a 42-byte stub file. First-time visitors are presented with the 3D HUD without guidance on how to navigate the 3D scene, inspect asteroids, or file claims.

### Why it matters
An interactive onboarding tour introduces core mission control features, reducing bounce rates for new visitors.

### Expected behaviour
`Onboarding.tsx` should detect new user sessions (via localStorage) and step through a 4-step guided tour of the HUD.

### Acceptance criteria
- [ ] Create step-by-step onboarding walkthrough in `src/components/Onboarding.tsx`.
- [ ] Highlight LeftSidebar catalog, 3D viewport, RightSidebar inspector, and Claim button.
- [ ] Persist completed state in localStorage.

### Likely files/components affected
- `src/components/Onboarding.tsx`
- `src/lib/cache.ts`"""
    },
    {
        "title": "Implement 2D orbital mini-map radar overlay in src/components/OrbitalMiniMap.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "UI / 2D Canvas Overlay",
        "body": """### Problem
`OrbitalMiniMap.tsx` is a 61-byte stub. Operators lack a top-down 2D radar mini-map displaying Earth and surrounding orbital object positions.

### Why it matters
A 2D radar mini-map provides high-level spatial context regardless of camera orientation in the 3D scene.

### Expected behaviour
Render a 2D HTML Canvas mini-map widget in the HUD corner showing Earth center, active satellites, and selected asteroid radar blips.

### Acceptance criteria
- [ ] Implement 2D Canvas rendering in `OrbitalMiniMap.tsx`.
- [ ] Project 3D XYZ coordinates onto 2D polar plane.
- [ ] Highlight selected object with animated reticle indicator.

### Likely files/components affected
- `src/components/OrbitalMiniMap.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement responsive mobile navigation bar in src/components/MobileNavbar.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / Mobile Optimization",
        "body": """### Problem
`MobileNavbar.tsx` is an incomplete 857-byte file. On small mobile screens, sidebar HUD overlays collide with viewport boundaries.

### Why it matters
A bottom mobile navigation bar allows touch users to toggle between Catalog, 3D Canvas, Inspector, and Terminal viewports smoothly.

### Expected behaviour
`MobileNavbar.tsx` should render a fixed bottom tab bar on mobile viewports (< 640px) allowing one-tap sidebar toggling.

### Acceptance criteria
- [ ] Implement fixed bottom navbar for viewports < 640px.
- [ ] Add view switches for Catalog, Telemetry, Terminal, and Settings.
- [ ] Ensure 44x44px minimum touch target sizes.

### Likely files/components affected
- `src/components/MobileNavbar.tsx`
- `src/app/page.tsx`"""
    },
    {
        "title": "Implement 3D star constellation lines and sun vector overlay in ConstellationOverlay.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Visualization",
        "body": """### Problem
`ConstellationOverlay.tsx` is a 67-byte stub file. The background starfield lacks constellation vector overlays or a directional sun vector arrow.

### Why it matters
Constellation lines and sun vectors orient space operators relative to the celestial sphere and solar illumination vectors.

### Expected behaviour
Render major astronomical constellation lines and a directional light vector indicator line in the 3D R3F scene.

### Acceptance criteria
- [ ] Create 3D line geometry for major celestial constellations in `ConstellationOverlay.tsx`.
- [ ] Render directional vector line pointing to sun coordinates.
- [ ] Add HUD toggle in `SettingsModal.tsx`.

### Likely files/components affected
- `src/components/ConstellationOverlay.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement atmospheric entry particle plasma glow in ReentryEffect.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / VFX",
        "body": """### Problem
`ReentryEffect.tsx` is a 73-byte stub. Satellites experiencing severe LEO orbital decay do not show atmospheric re-entry heating effects.

### Why it matters
Visual plasma glow and entry particle trails vividly signify imminent satellite orbital destruction when falling below critical altitudes.

### Expected behaviour
When a satellite altitude falls below 150 km, render a fiery plasma trail and particle emitter around the satellite mesh.

### Acceptance criteria
- [ ] Implement particle emitter shader in `ReentryEffect.tsx`.
- [ ] Trigger plasma particle trail when altitude < 150 km.
- [ ] Provide performance toggle in settings.

### Likely files/components affected
- `src/components/ReentryEffect.tsx`
- `src/components/SatelliteSystem.tsx`"""
    },
    {
        "title": "Implement orbital inclination angle arc visualizer in InclinationVisualizer.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Math Visualization",
        "body": """### Problem
`InclinationVisualizer.tsx` is an 82-byte stub. Users inspecting an orbit cannot see a visual angle arc indicating its inclination relative to Earth's equatorial plane.

### Why it matters
Visualizing inclination arcs helps students and space enthusiasts understand Keplerian inclination angles ($i$).

### Expected behaviour
Render an angle arc and degree label between Earth's equatorial plane and the selected object's orbital plane.

### Acceptance criteria
- [ ] Construct 3D arc geometry for inclination angle $i$ in `InclinationVisualizer.tsx`.
- [ ] Display formatted degree text (`inc = 28.5°`).
- [ ] Render arc dynamically when object is selected.

### Likely files/components affected
- `src/components/InclinationVisualizer.tsx`
- `src/components/OrbitVisualizer.tsx`"""
    },
    {
        "title": "Implement typed localStorage cache wrapper with TTL expiration in src/lib/cache.ts",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Storage",
        "body": """### Problem
`src/lib/cache.ts` contains basic key constants but lacks a robust cache wrapper supporting generic types, TTL expiration, and storage error handling.

### Why it matters
Safe storage wrappers prevent app crashes when `localStorage` is full or disabled in private browsing modes.

### Expected behaviour
Provide `getCacheItem<T>(key, defaultValue)`, `setCacheItem<T>(key, value, ttlMs)`, and `clearCache()`.

### Acceptance criteria
- [ ] Implement `getCacheItem` and `setCacheItem` in `src/lib/cache.ts`.
- [ ] Support TTL expiration timestamps.
- [ ] Wrap `localStorage` calls in try/catch to handle storage quota exceptions gracefully.

### Likely files/components affected
- `src/lib/cache.ts`"""
    },
    {
        "title": "Implement AU kilometer and scene unit conversion helpers in src/lib/helpers.ts",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Math / Refactoring",
        "body": """### Problem
`src/lib/helpers.ts` is a 97-byte stub file. Distance unit conversions between Astronomical Units (AU), kilometers, and scene units are duplicated across components.

### Why it matters
Centralizing astronomical distance conversion logic ensures mathematical precision and avoids duplication.

### Expected behaviour
Export `auToKm(au: number): number`, `kmToAu(km: number): number`, and `formatDistanceAU(au: number): string` in `src/lib/helpers.ts`.

### Acceptance criteria
- [ ] Define `AU_IN_KM = 149597870.7` in `src/lib/helpers.ts`.
- [ ] Implement unit conversion functions.
- [ ] Write unit tests verifying conversion calculations.

### Likely files/components affected
- `src/lib/helpers.ts`
- `tests/unit/helpers.test.ts`"""
    },
    {
        "title": "Decouple Keplerian physical constants into dedicated module src/lib/constants.ts",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Math / Refactoring",
        "body": """### Problem
`src/lib/constants.ts` is a 71-byte stub file. Physical constants (Earth radius 6378 km, $\\mu_E = 3.986e5$, scene time scale) are scattered across multiple files.

### Why it matters
Centralizing physics constants in a single module guarantees consistency and simplifies scientific parameter tuning.

### Expected behaviour
Export typed physics constants (`EARTH_RADIUS_KM`, `MU_EARTH`, `SCENE_SCALE_KM`) from `src/lib/constants.ts`.

### Acceptance criteria
- [ ] Create `src/lib/constants.ts` with typed exports.
- [ ] Refactor `kepler.ts` and `useOrbitalObjects.ts` to import from `constants.ts`.
- [ ] Verify zero physics regression.

### Likely files/components affected
- `src/lib/constants.ts`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement user profile page route /profile listing user claimed asteroids",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Next.js Architecture / Pages",
        "body": """### Problem
AstroDex lacks a dedicated `/profile` page route for authenticated users to view, manage, and inspect all asteroids they have claimed.

### Why it matters
A profile page gives users a dedicated portal to view their mining claims, totals, and orbital statistics.

### Expected behaviour
Create Next.js App Router page `src/app/profile/page.tsx` fetching user claims and displaying claimed asteroid cards.

### Acceptance criteria
- [ ] Create `src/app/profile/page.tsx`.
- [ ] Display authenticated user profile details and claimed objects grid.
- [ ] Provide 'Unclaim' action button per claimed item.

### Likely files/components affected
- `src/app/profile/page.tsx`
- `src/components/UserProfileModal.tsx`"""
    },
    {
        "title": "Implement asteroid composition material breakdown visualizer in AsteroidCard.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Feature",
        "body": """### Problem
`AsteroidCard.tsx` displays basic orbital parameters but does not show estimated mineral composition (Iron, Nickel, Water Ice, Precious Metals).

### Why it matters
Displaying mineral composition breakdowns adds immersion to the simulated asteroid mining claim system.

### Expected behaviour
Render a visual composition percentage bar (e.g. 60% Iron, 30% Nickel, 10% Water Ice) inside `AsteroidCard.tsx`.

### Acceptance criteria
- [ ] Derive procedural composition percentages from asteroid ID seed.
- [ ] Render stacked color bar in `AsteroidCard.tsx`.
- [ ] Include tooltips explaining mineral values.

### Likely files/components affected
- `src/components/AsteroidCard.tsx`"""
    },
    {
        "title": "Implement quick Reset Simulation button in Header.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Controls",
        "body": """### Problem
If users modify simulation speed or camera focus, there is no single button in `Header.tsx` to quickly reset time scale and selection state to defaults.

### Why it matters
A reset simulation button provides a quick panic button to restore nominal mission control settings.

### Expected behaviour
Add a 'Reset Sim' button in `Header.tsx` restoring 1x speed, unselecting objects, and resetting camera target.

### Acceptance criteria
- [ ] Add Reset Sim button to `Header.tsx`.
- [ ] Reset simulation speed multiplier to 1.0.
- [ ] Unselect active target and center view on Earth.

### Likely files/components affected
- `src/components/Header.tsx`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Implement orbital period countdown timer for selected satellites in CountdownTimer.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Telemetry Feature",
        "body": """### Problem
`CountdownTimer.tsx` is an 87-byte stub file. The HUD does not display a live countdown timer showing time remaining until the next perigee/apogee passage.

### Why it matters
Orbital passage countdown timers are standard space mission control instruments.

### Expected behaviour
Render a real-time countdown timer in `CountdownTimer.tsx` updating time remaining in current orbit revolution.

### Acceptance criteria
- [ ] Implement `CountdownTimer.tsx` calculating $T_{\\\\text{rem}} = (1 - M / 2\\pi) \\cdot T_{\\\\text{period}}$.
- [ ] Display formatted `MM:SS` timer in RightSidebar.
- [ ] Update live during simulation playback.

### Likely files/components affected
- `src/components/CountdownTimer.tsx`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Implement responsive full-screen 3D viewport toggle for mobile touch devices",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Mobile UX",
        "body": """### Problem
Mobile touch users struggle with small 3D viewports squeezed between top header and bottom sidebars.

### Why it matters
A full-screen viewport mode hides all HTML overlays on mobile, dedicating the full touchscreen to 3D gesture interaction.

### Expected behaviour
Add a mobile viewport expand button in `MobileNavbar.tsx` hiding sidebars and giving 100vh to the R3F Canvas.

### Acceptance criteria
- [ ] Add expand viewport toggle in `MobileNavbar.tsx`.
- [ ] Hide sidebars and display floating exit button on mobile.
- [ ] Ensure smooth touch pinch/zoom controls.

### Likely files/components affected
- `src/components/MobileNavbar.tsx`
- `src/app/page.tsx`"""
    },
    {
        "title": "Clean up obsolete debug console statements across src codebase",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Code Quality / Refactoring",
        "body": """### Problem
Multiple component files contain leftover `console.log` statements used during initial development, cluttering browser devtools logs.

### Why it matters
Removing leftover debug logs improves console cleanliness and prevents unnecessary string serialization overhead in production builds.

### Expected behaviour
Audit `src/` directory and remove non-essential `console.log` statements, replacing necessary system logs with `console.error` or `console.warn`.

### Acceptance criteria
- [ ] Remove dev debug `console.log` statements across `src/components/` and `src/lib/`.
- [ ] Ensure production console remains clean on startup.
- [ ] Verify build compiles cleanly.

### Likely files/components affected
- `src/lib/store.tsx`
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Enforce strict ESLint rules for react-hooks/exhaustive-deps across src",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Code Quality / ESLint",
        "body": """### Problem
`eslint.config.mjs` configures `react-hooks` rules, but several `useEffect` and `useMemo` hooks across `src/` omit required dependency array values.

### Why it matters
Missing hook dependencies cause subtle stale closure bugs and state sync errors.

### Expected behaviour
Audit all custom hooks and components in `src/` to satisfy `react-hooks/exhaustive-deps`.

### Acceptance criteria
- [ ] Run `npm run lint` and identify hook dependency warnings.
- [ ] Add missing dependencies or refactor callbacks with `useCallback`.
- [ ] Ensure `npm run lint` finishes with 0 warnings.

### Likely files/components affected
- `eslint.config.mjs`
- `src/components/LeftSidebar.tsx`
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Add global CSS font-display swap optimization for Geist and JetBrains Mono fonts",
        "labels": ["gssoc", "level:beginner", "type:performance"],
        "category": "Performance / Typography",
        "body": """### Problem
Font loading definitions in `src/app/layout.tsx` do not explicitly specify `display: 'swap'`, causing FOIT (Flash of Invisible Text) on slower mobile connections.

### Why it matters
Configuring `font-display: swap` ensures fallback system fonts render immediately while custom web fonts load in the background.

### Expected behaviour
Set `display: 'swap'` on Geist and JetBrains Mono `next/font` configuration objects in `src/app/layout.tsx`.

### Acceptance criteria
- [ ] Add `display: 'swap'` to font loader definitions in `src/app/layout.tsx`.
- [ ] Verify text is visible immediately during simulated slow network loads.

### Likely files/components affected
- `src/app/layout.tsx`"""
    },
    {
        "title": "Implement automated TypeScript strict null checks across all helper functions",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "TypeScript / Refactoring",
        "body": """### Problem
Several utility functions in `src/lib/` accept nullable parameters without explicit null checks (`if (!val) return`), risking runtime `TypeError: Cannot read properties of null`.

### Why it matters
Strict null checks prevent unexpected null dereference crashes across state handlers and math helpers.

### Expected behaviour
Add explicit null/undefined guard clauses and optional chaining operators (`?.`) across all exported helper functions.

### Acceptance criteria
- [ ] Add null guards to helper functions in `src/lib/`.
- [ ] Ensure strict type narrowing is satisfied.
- [ ] Confirm clean compilation with `npm run typecheck`.

### Likely files/components affected
- `src/lib/helpers.ts`
- `src/lib/api.ts`"""
    },
    {
        "title": "Create reusable LoadingSpinner and LoadingSkeleton UI component primitives",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "UI / Components",
        "body": """### Problem
`LoadingSpinner.tsx` and `LoadingSkeleton.tsx` contain syntax errors and duplicate inline spinner SVGs across HUD panels.

### Why it matters
Abstracting loading UI indicators into clean component primitives ensures visual consistency across all loading states.

### Expected behaviour
Fix syntax errors in `LoadingSpinner.tsx` and `LoadingSkeleton.tsx` and export reusable primitives.

### Acceptance criteria
- [ ] Fix syntax errors in `LoadingSpinner.tsx` and `LoadingSkeleton.tsx`.
- [ ] Export `LoadingSpinner` with size/color props.
- [ ] Use `LoadingSpinner` in `LeftSidebar` catalog loading states.

### Likely files/components affected
- `src/components/LoadingSpinner.tsx`
- `src/components/LoadingSkeleton.tsx`"""
    },
    {
        "title": "Add explicit strict typing to all Next.js App Router Page and Layout props",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "TypeScript / Architecture",
        "body": """### Problem
Page components in `src/app/` use implicit `any` or untyped parameter signatures for `params` and `searchParams`.

### Why it matters
Next.js 16 App Router requires explicit promise/type contracts for `params` to ensure type safety.

### Expected behaviour
Define explicit TypeScript interfaces for all page route props (`PageProps`, `LayoutProps`).

### Acceptance criteria
- [ ] Define typed interfaces for `params` and `searchParams` in `src/app/page.tsx` and `src/app/auth/page.tsx`.
- [ ] Verify `npm run typecheck` passes without implicit `any` warnings.

### Likely files/components affected
- `src/app/page.tsx`
- `src/app/auth/page.tsx`
- `src/app/layout.tsx`"""
    },
    {
        "title": "Consolidate global CSS custom properties in globals.css into Tailwind theme tokens",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Styling",
        "body": """### Problem
Custom CSS properties in `src/app/globals.css` duplicate glassmorphism colors and border radiuses defined in Tailwind v4 `@theme`.

### Why it matters
Consolidating design tokens into Tailwind v4 theme blocks ensures single-source-of-truth styling across all HUD elements.

### Expected behaviour
Move custom CSS variables from `globals.css` into Tailwind v4 `@theme` directive tokens.

### Acceptance criteria
- [ ] Refactor `:root` CSS variables in `globals.css` into Tailwind `@theme`.
- [ ] Replace custom CSS var references with Tailwind utility classes.
- [ ] Verify HUD styling remains visually intact.

### Likely files/components affected
- `src/app/globals.css`
- `src/styles/`"""
    },
    {
        "title": "Refactor CameraController to handle window resize aspect ratio updates smoothly",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / Camera Bug",
        "body": """### Problem
Resizing the browser window while camera lerp tracking is active causes camera target offsets to jump abruptly due to un-handled aspect ratio recalculation.

### Why it matters
Window resize events during active inspection lerps produce visual viewport jarring.

### Expected behaviour
`CameraController.tsx` should listen to window resize events, updating `camera.aspect` and invoking `camera.updateProjectionMatrix()` smoothly.

### Acceptance criteria
- [ ] Add window resize listener in `CameraController.tsx`.
- [ ] Recalculate camera aspect ratio dynamically.
- [ ] Ensure smooth lerp continuation during window resizing.

### Likely files/components affected
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Add unit tests for error boundary recovery in ErrorBoundary.tsx",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / React",
        "body": """### Problem
`src/components/ErrorBoundary.tsx` catches React render crashes, but has zero automated unit tests verifying error fallback display and reset recovery.

### Why it matters
Error boundaries prevent white-screen crashes. Testing ensures fallback UI renders cleanly when child components throw exceptions.

### Expected behaviour
Write unit tests using `@testing-library/react` asserting fallback UI renders on error and resets state on reset button click.

### Acceptance criteria
- [ ] Write unit test for `ErrorBoundary.tsx` catching a throwing child component.
- [ ] Assert fallback UI text is displayed.
- [ ] Verify reset action clears error state.

### Likely files/components affected
- `src/components/__tests__/ErrorBoundary.test.tsx`
- `src/components/ErrorBoundary.tsx`"""
    },
    {
        "title": "Create comprehensive CONTRIBUTING.md section detailing GSSoC submission rules",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / Project Guidelines",
        "body": """### Problem
`CONTRIBUTING.md` lacks clear instructions on GSSoC issue claiming commands (`/assign`), assignment limits (3 issues max), and PR submission deadlines.

### Why it matters
Clear contributor guidelines prevent issue hoarding and reduce maintainer triage effort.

### Expected behaviour
Update `CONTRIBUTING.md` with explicit sections covering `/assign` rules, PR linking conventions (`Fixes #123`), and verification command steps.

### Acceptance criteria
- [ ] Add GSSoC workflow rules section to `CONTRIBUTING.md`.
- [ ] Include command examples for local build, typecheck, and vitest testing.
- [ ] Detail PR description requirements.

### Likely files/components affected
- `CONTRIBUTING.md`"""
    },
    {
        "title": "Optimize WebGL shadow map resolution settings in Scene.tsx",
        "labels": ["gssoc", "level:intermediate", "type:performance"],
        "category": "3D / Performance",
        "body": """### Problem
Directional light shadow maps in `Scene.tsx` use a fixed high-resolution buffer (4096x4096), causing GPU memory pressure on mobile devices.

### Why it matters
High shadow map resolutions degrade framerates on integrated graphics and mobile GPUs.

### Expected behaviour
Scale shadow map resolution dynamically based on device pixel ratio / hardware performance tier (1024 for mobile, 2048 for desktop).

### Acceptance criteria
- [ ] Detect mobile device tier in `Scene.tsx`.
- [ ] Set directional light `shadow-mapSize` dynamically.
- [ ] Confirm framerate improvements on mobile viewports.

### Likely files/components affected
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Add ARIA live region notification when claiming or unclaiming an asteroid",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / HUD",
        "body": """### Problem
Filing or unclaiming a mining claim updates state and displays a visual toast, but provides no auditory notification to screen reader users.

### Why it matters
Screen reader users need confirmation when critical actions (claiming an asteroid) complete successfully.

### Expected behaviour
Announce claim success or unclaim status via an `aria-live=\"polite\"` notification helper.

### Acceptance criteria
- [ ] Invoke `announce()` helper in `ClaimButton.tsx` on claim action completion.
- [ ] Announce \"Asteroid AST-0042 successfully claimed\" to assistive tools.
- [ ] Test with screen reader.

### Likely files/components affected
- `src/components/ClaimButton.tsx`
- `src/lib/announce.ts`"""
    },
    {
        "title": "Refactor SatelliteSystem to use memoized orbit color palette lookup",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Performance",
        "body": """### Problem
`SatelliteSystem.tsx` instantiates new `THREE.Color` objects inside render loops to resolve orbit line color palettes.

### Why it matters
Creating color instances repeatedly inside render loops increases garbage collection overhead.

### Expected behaviour
Memoize satellite orbit line color palettes using a static color map lookup object.

### Acceptance criteria
- [ ] Create static `COLOR_MAP` object in `SatelliteSystem.tsx`.
- [ ] Reuse static `THREE.Color` instances for orbit line rendering.
- [ ] Verify visual orbit colors remain unchanged.

### Likely files/components affected
- `src/components/SatelliteSystem.tsx`"""
    },
    {
        "title": "Add automated security headers check script to package.json scripts",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Tooling",
        "body": """### Problem
`package.json` lacks an automated script command (`npm run check:security`) to validate HTTP security header configurations locally.

### Why it matters
Allowing developers to run security header checks locally catches missing headers before pushing to staging.

### Expected behaviour
Add `"check:security": "node scripts/check-security-headers.js"` to `package.json` scripts.

### Acceptance criteria
- [ ] Create `scripts/check-security-headers.js` checking CSP and security header responses.
- [ ] Add `"check:security"` script to `package.json`.
- [ ] Verify script executes cleanly.

### Likely files/components affected
- `package.json`
- `scripts/check-security-headers.js`"""
    },
    {
        "title": "Add automated issue labeler rule configuration in .github/workflows/auto-label.yml",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / CI Automation",
        "body": """### Problem
`.github/workflows/auto-label.yml` contains basic triggers but lacks path-based automated labeling rules for pull requests.

### Why it matters
Automatically labeling PRs based on modified file paths (e.g. `src/components/earth/**` -> `3d`, `docs/**` -> `type:docs`) streamlines maintainer PR triage.

### Expected behaviour
Configure `.github/workflows/auto-label.yml` using `actions/labeler` with path matching rules defined in `.github/labeler.yml`.

### Acceptance criteria
- [ ] Create `.github/labeler.yml` with path mappings (`3d`, `accessibility`, `documentation`, `testing`).
- [ ] Update `.github/workflows/auto-label.yml` to execute on PR creation.
- [ ] Test automatic label assignment.

### Likely files/components affected
- `.github/workflows/auto-label.yml`
- `.github/labeler.yml`"""
    },
    {
        "title": "Implement dark mode color contrast enhancement in Tailwind configuration",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "UI / Accessibility",
        "body": """### Problem
Secondary HUD text colors (`text-slate-400` on dark glassmorphism backgrounds) currently fail WCAG AA 4.5:1 color contrast requirements.

### Why it matters
Low color contrast makes HUD telemetry metrics difficult to read for users with low vision or bright ambient lighting.

### Expected behaviour
Update dark mode color utility classes across HUD sidebars to ensure minimum 4.5:1 WCAG AA contrast ratio.

### Acceptance criteria
- [ ] Run automated Lighthouse accessibility audit.
- [ ] Update text colors in `LeftSidebar.tsx` and `RightSidebar.tsx` to `text-slate-200`/`text-slate-300`.
- [ ] Verify WCAG AA contrast compliance.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Add informative tooltips to complex Keplerian orbital parameters in RightSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / UX Enhancement",
        "body": """### Problem
`RightSidebar.tsx` displays Keplerian parameters (semi-major axis $a$, eccentricity $e$, mean anomaly $M$) without explanatory tooltips.

### Why it matters
Casual users and students may not understand orbital mechanics terms without quick hover explanations.

### Expected behaviour
Wrap Keplerian metric labels in `RightSidebar.tsx` with accessible `<Tooltip>` components providing short definitions.

### Acceptance criteria
- [ ] Add tooltips for $a$ (semi-major axis), $e$ (eccentricity), $i$ (inclination), and $v$ (Vis-Viva velocity).
- [ ] Provide clear plain-English definitions.
- [ ] Ensure tooltips work via hover and keyboard focus.

### Likely files/components affected
- `src/components/RightSidebar.tsx`
- `src/components/Tooltip.tsx`"""
    },
    {
        "title": "Implement custom CSS scrollbars matching space theme in globals.css",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Styling",
        "body": """### Problem
Browser default scrollbars in catalog lists and terminal panels break the dark space glassmorphism HUD design aesthetic.

### Why it matters
Custom styled scrollbars maintain a cohesive visual identity across Chrome, Firefox, and Safari browsers.

### Expected behaviour
Define custom `::-webkit-scrollbar` and Firefox `scrollbar-color` rules in `globals.css` matching dark slate HUD tokens.

### Acceptance criteria
- [ ] Add dark glassmorphism scrollbar styling in `src/app/globals.css`.
- [ ] Set thin scrollbar width (6px) with rounded thumb tracks.
- [ ] Test cross-browser scrollbar appearance in LeftSidebar and AgentTerminal.

### Likely files/components affected
- `src/app/globals.css`"""
    },
    {
        "title": "Implement pagination for long catalog lists in LeftSidebar.tsx",
        "labels": ["gssoc", "level:intermediate", "type:performance"],
        "category": "UI / Performance",
        "body": """### Problem
Rendering 600+ asteroid items simultaneously in `LeftSidebar.tsx` creates high DOM node counts and causes scroll lag.

### Why it matters
Virtualizing or paginating long lists reduces active DOM nodes, improving scroll performance on mobile devices.

### Expected behaviour
Implement pagination or windowed virtualization (displaying 20 items per page) in `LeftSidebar.tsx`.

### Acceptance criteria
- [ ] Add page pagination controls (20 items per page) to `LeftSidebar.tsx`.
- [ ] Update active page display cleanly.
- [ ] Verify DOM node count drops dramatically.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Design space-themed custom 404 Not Found page in src/app/not-found.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "Next.js Architecture / Pages",
        "body": """### Problem
Invalid URL routes fall back to default Next.js plain 404 text pages without space theme styling or navigation back to mission control.

### Why it matters
A custom 404 page provides a polished user experience and guides lost users back to Earth orbit simulation.

### Expected behaviour
Create `src/app/not-found.tsx` featuring a space-themed layout (\"Lost in Deep Space - 404\") and a 'Return to Control Room' button.

### Acceptance criteria
- [ ] Create `src/app/not-found.tsx`.
- [ ] Style with dark space background and glassmorphic container.
- [ ] Include Link button navigating back to `/`.

### Likely files/components affected
- `src/app/not-found.tsx`"""
    },
    {
        "title": "Add Return to Earth reset view button in Header.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Controls",
        "body": """### Problem
When inspecting distant asteroids thousands of kilometers away, returning camera focus back to Earth requires unselecting objects or refreshing.

### Why it matters
A prominent 'Focus Earth' button in Header provides instant camera reset to home position.

### Expected behaviour
Add an Earth icon button in `Header.tsx` triggering camera lerp back to origin `(0, 0, 0)`.

### Acceptance criteria
- [ ] Add Earth reset button in `Header.tsx`.
- [ ] Clear selected target state in `store.tsx`.
- [ ] Lerp camera back to initial overview coordinates.

### Likely files/components affected
- `src/components/Header.tsx`
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Enhance toast notification entry and exit CSS keyframe animations",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Animations",
        "body": """### Problem
Toast notifications in `Toasts.tsx` pop into view abruptly without entry slide-in or fade-out keyframe transitions.

### Why it matters
Smooth micro-animations make HUD notification toasts feel premium and reactive.

### Expected behaviour
Add CSS slide-in-right and fade-out keyframe animations to toast containers in `Toasts.tsx`.

### Acceptance criteria
- [ ] Define `@keyframes toastSlideIn` in `globals.css`.
- [ ] Apply smooth entry and exit animation classes in `Toasts.tsx`.
- [ ] Ensure animations respect `prefers-reduced-motion`.

### Likely files/components affected
- `src/components/Toasts.tsx`
- `src/app/globals.css`"""
    },
    {
        "title": "Add multi-criteria sorting (Distance, Speed, Size) for asteroid catalog",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Catalog Feature",
        "body": """### Problem
`LeftSidebar.tsx` presents asteroids in fixed numerical ID order without options to sort by orbital radius, speed, or size.

### Why it matters
Sorting options allow space operators to locate the closest, fastest, or largest near-Earth objects instantly.

### Expected behaviour
Add a sort dropdown in `LeftSidebar.tsx` offering sort by Name, Distance, Velocity, and Hazard Status.

### Acceptance criteria
- [ ] Add `sortBy` state selector in `LeftSidebar.tsx`.
- [ ] Sort catalog array dynamically.
- [ ] Maintain debounced filtering alongside sorting.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Display live 3D XYZ coordinate readout for selected object in RightSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Telemetry Feature",
        "body": """### Problem
`RightSidebar.tsx` displays orbital elements but does not show real-time 3D Cartesian coordinates $(X, Y, Z)$ in scene units / kilometers.

### Why it matters
Cartesian position readouts are fundamental telemetry metrics for 3D spatial situational awareness.

### Expected behaviour
Display dynamic live $(X, Y, Z)$ coordinate readouts updating per frame in `RightSidebar.tsx` when an object is selected.

### Acceptance criteria
- [ ] Read live position vector of selected object.
- [ ] Format $X, Y, Z$ coordinates in kilometers in `RightSidebar.tsx`.
- [ ] Update readout during animation frames.

### Likely files/components affected
- `src/components/RightSidebar.tsx`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Fix misaligned input fields on claim submission form on tablet screens",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "UI / Responsive Bug",
        "body": """### Problem
On medium viewports (768px tablet resolution), input fields and submit buttons inside `AsteroidClaim.tsx` misalign due to static flex basis constraints.

### Why it matters
Misaligned forms break visual layout harmony and harm user experience on tablet devices.

### Expected behaviour
Use responsive Tailwind grid / flex classes (`grid-cols-1 md:grid-cols-2`) to ensure inputs align on tablet screens.

### Acceptance criteria
- [ ] Refactor form layout in `AsteroidClaim.tsx` with responsive grid utilities.
- [ ] Verify clean form alignment on 768px viewports.

### Likely files/components affected
- `src/components/AsteroidClaim.tsx`"""
    },
    {
        "title": "Add confirmation modal prompt before unclaiming an asteroid",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Safety Feature",
        "body": """### Problem
Clicking 'Unclaim' on a claimed asteroid immediately releases the mining claim without asking for confirmation.

### Why it matters
Accidental clicks can cause users to unintentionally surrender valuable asteroid claims.

### Expected behaviour
Display a confirmation dialog modal (\"Are you sure you want to release your mining claim?\") before processing unclaim requests.

### Acceptance criteria
- [ ] Add confirmation modal trigger to `ClaimButton.tsx`.
- [ ] Process unclaim action only upon user confirmation.
- [ ] Allow cancelling unclaim dialog.

### Likely files/components affected
- `src/components/ClaimButton.tsx`
- `src/components/RiskModal.tsx`"""
    },
    {
        "title": "Enhance focus ring visibility for all interactive HUD buttons in high contrast mode",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility",
        "body": """### Problem
Focus outlines on dark glassmorphism HUD buttons are faint and difficult to see for keyboard users in high-contrast mode.

### Why it matters
Distinct, high-contrast focus indicators (`focus-visible:ring-2 focus-visible:ring-cyan-400`) are required for WCAG 2.1 keyboard navigation compliance.

### Expected behaviour
Apply visible 2px cyan focus rings to all interactive buttons, links, and sliders across HUD components.

### Acceptance criteria
- [ ] Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400` to HUD buttons.
- [ ] Test keyboard tabbing across Header, Sidebars, and Modals.
- [ ] Ensure focus rings stand out clearly against dark backgrounds.

### Likely files/components affected
- `src/components/Header.tsx`
- `src/components/LeftSidebar.tsx`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Implement LOD (Level of Detail) lower-poly meshes for distant asteroids",
        "labels": ["gssoc", "level:advanced", "type:performance"],
        "category": "3D / Performance",
        "body": """### Problem
Distant asteroids hundreds of scene units away are rendered with identical geometric vertex detail as close-up asteroids.

### Why it matters
Rendering high-poly geometries for distant sub-pixel objects wastes GPU shader processing power.

### Expected behaviour
Implement Level of Detail (LOD) rendering so asteroids beyond distance thresholds use lower-poly instanced geometries.

### Acceptance criteria
- [ ] Create low-poly ICO sphere geometry in `AsteroidField.tsx`.
- [ ] Swap distance-based rendering instance matrices or use Three.js `LOD`.
- [ ] Verify GPU framerate improvements during zoomed-out Earth view.

### Likely files/components affected
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Add procedural asteroid axial spin animation in AsteroidField.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Animation",
        "body": """### Problem
Asteroids currently orbit Earth on Keplerian ellipses but do not rotate around their own internal axes as they move.

### Why it matters
Adding axial rotation (spin velocity) to individual asteroid instances makes the 3D space scene feel alive and physically realistic.

### Expected behaviour
Apply angular velocity rotation around individual instance axes in `AsteroidField.tsx` `useFrame` loop.

### Acceptance criteria
- [ ] Assign random rotation speeds to asteroid instances in data generator.
- [ ] Apply instance rotation matrices in `useFrame`.
- [ ] Verify smooth 60 fps asteroid spin animation.

### Likely files/components affected
- `src/components/AsteroidField.tsx`
- `src/hooks/useOrbitalObjects.ts`"""
    },
    {
        "title": "Create sun lens flare post-processing bloom effect in PostProcessing.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Post-processing",
        "body": """### Problem
Looking directly towards the sun light vector in the 3D viewport renders a standard directional light without camera lens flare artifacts.

### Why it matters
Realistic lens flares when sweeping the camera past the sun add a cinematic sci-fi atmosphere to space exploration.

### Expected behaviour
Configure lens flare / optical bloom effects in `PostProcessing.tsx` when the sun light source is in view.

### Acceptance criteria
- [ ] Add lens flare effect component to `PostProcessing.tsx`.
- [ ] Occlude lens flare when Earth passes between camera and sun.
- [ ] Provide toggle in graphics settings.

### Likely files/components affected
- `src/components/PostProcessing.tsx`"""
    },
    {
        "title": "Add subtle camera shake effect on high-speed camera lerp transitions",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / VFX",
        "body": """### Problem
Camera tracking lerps transition smoothly to selected asteroids, but lack cinematic thrill or acceleration feedback.

### Why it matters
A subtle procedural camera shake during high-speed camera travel gives the user a sense of velocity.

### Expected behaviour
Add minor procedural noise offset to `camera.position` in `CameraController.tsx` during rapid camera lerp travel.

### Acceptance criteria
- [ ] Compute camera travel velocity in `CameraController.tsx`.
- [ ] Add slight procedural offset when travel speed > threshold.
- [ ] Disable camera shake when `prefers-reduced-motion` is enabled.

### Likely files/components affected
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Add dynamic procedural starfield background shader in Scene.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Shaders",
        "body": """### Problem
Background space uses generic Drei `<Stars />` points without subtle star twinkling or color temperature variations (blue giant, red dwarf).

### Why it matters
A custom GLSL starfield shader with twinkling star points and realistic color temperatures enriches background depth.

### Expected behaviour
Replace default background points with a custom R3F starfield shader points material in `Scene.tsx`.

### Acceptance criteria
- [ ] Implement custom starfield vertex/fragment shader in `Scene.tsx`.
- [ ] Add subtle time-based twinkling uniform.
- [ ] Vary star colors between blue, white, and orange points.

### Likely files/components affected
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Batch setColorAt calls and optimize instanceMatrix.needsUpdate in AsteroidField.tsx",
        "labels": ["gssoc", "level:intermediate", "type:performance"],
        "category": "3D / Performance",
        "body": """### Problem
`AsteroidField.tsx` sets `instanceMatrix.needsUpdate = true` on every frame, even when no asteroid matrices or colors changed.

### Why it matters
Flagging instanced buffers for GPU re-upload on frames without position changes causes unnecessary CPU-GPU memory bandwidth overhead.

### Expected behaviour
Only set `instanceMatrix.needsUpdate = true` or `instanceColor.needsUpdate = true` when orbital positions or colors actually change.

### Acceptance criteria
- [ ] Track buffer mutation flag in `AsteroidField.tsx`.
- [ ] Skip `needsUpdate` assignment on static frames.
- [ ] Verify GPU rendering efficiency improvements.

### Likely files/components affected
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Create Storybook-style HUD component showcase documentation in docs/storybook.md",
        "labels": ["gssoc", "level:intermediate", "type:documentation"],
        "category": "Documentation / UI Architecture",
        "body": """### Problem
`docs/storybook.md` is an 84-byte stub file containing no component showcase documentation or UI primitive guidelines.

### Why it matters
Documenting HUD UI components (Buttons, Modals, Toasts, Cards) helps contributors build new UI features matching established design patterns.

### Expected behaviour
`docs/storybook.md` should document all core HUD component primitives, props, and design token usage.

### Acceptance criteria
- [ ] Document HUD components in `docs/storybook.md`.
- [ ] Detail prop signatures for `AsteroidCard`, `ClaimButton`, `LoadingSpinner`, and `Tooltip`.
- [ ] Include UI preview usage examples.

### Likely files/components affected
- `docs/storybook.md`"""
    }
]

print(f"Total proposed Batch 3 issues: {len(batch3_issues)}")

created_count = 0
dup_count = 0
for idx, issue in enumerate(batch3_issues, 101):
    t_lower = issue["title"].lower()
    if t_lower in existing_titles:
        print(f"Skipping duplicate issue: {issue['title']}")
        dup_count += 1
        continue
    
    cmd = [
        "gh", "issue", "create",
        "--title", issue["title"],
        "--body", issue["body"],
    ]
    for lbl in issue["labels"]:
        cmd.extend(["--label", lbl])
    
    print(f"[{idx}/150] Creating issue: {issue['title']} (Labels: {issue['labels']})")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        created_count += 1
        existing_titles.add(t_lower)
        print(f"  -> Created successfully: {res.stdout.strip()}")
    else:
        print(f"  -> Failed: {res.stderr.strip()}")
    time.sleep(0.5)

print(f"\nBatch 3 Summary: Created {created_count} issues. Skipped {dup_count} duplicates.")
