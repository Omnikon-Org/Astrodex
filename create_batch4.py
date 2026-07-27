import json
import subprocess
import time
import sys

with open("existing_titles.json", "r") as f:
    existing_titles = set(json.load(f))

batch4_issues = [
    {
        "title": "Implement Playwright E2E test for 3D Earth WebGL context initialization in WebGLContext.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/WebGLContext.test.ts` is a 77-byte stub file. AstroDex lacks automated Playwright browser end-to-end tests verifying WebGL canvas context instantiation.

### Why it matters
Browser WebGL canvas initialization is the foundational prerequisite for rendering the 3D Earth simulation. E2E tests ensure canvas context creates without console errors.

### Expected behaviour
Write Playwright browser tests asserting `<canvas>` renders in DOM and WebGL context is initialized cleanly without WebGL context loss errors.

### Acceptance criteria
- [ ] Implement Playwright E2E test in `tests/e2e/WebGLContext.test.ts`.
- [ ] Assert WebGL canvas element exists in viewport.
- [ ] Ensure test passes under Playwright headless test runner.

### Likely files/components affected
- `tests/e2e/WebGLContext.test.ts`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for 3D Earth mesh rendering in EarthMesh.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/EarthMesh.test.ts` is a 138-byte stub. E2E testing is missing for procedural Earth textures and shader material loading.

### Why it matters
Validating Earth mesh loading in real browsers ensures procedural canvas textures compile and apply to 3D spheres.

### Expected behaviour
Write Playwright tests checking Earth mesh component rendering and canvas texture generation without WebGL shader compilation errors.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/EarthMesh.test.ts`.
- [ ] Assert Earth 3D component renders in canvas scene.
- [ ] Verify zero WebGL shader errors in browser console.

### Likely files/components affected
- `tests/e2e/EarthMesh.test.ts`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for AsteroidField instanced mesh interaction in InstancedMesh.test.ts",
        "labels": ["gssoc", "level:advanced", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/InstancedMesh.test.ts` is a 151-byte stub. There is no automated browser test verifying 600+ instanced asteroids render and respond to pointer selection clicks.

### Why it matters
Instanced mesh selection is the primary user interaction in AstroDex. E2E testing guarantees raycasting selection works across browser engines.

### Expected behaviour
Playwright E2E test should click 3D asteroid targets and verify the RightSidebar inspector opens with selected object details.

### Acceptance criteria
- [ ] Implement E2E interaction test in `tests/e2e/InstancedMesh.test.ts`.
- [ ] Simulate click on 3D canvas object.
- [ ] Assert target object state updates in RightSidebar.

### Likely files/components affected
- `tests/e2e/InstancedMesh.test.ts`
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for Bloom and Vignette post-processing toggles in Bloom.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/Bloom.test.ts` is a 137-byte stub file. Post-processing effects (Bloom intensity, Vignette) lack E2E verification when toggled in SettingsModal.

### Why it matters
Graphics settings toggles must reliably update post-processing passes without tearing or crashing WebGL render pipelines.

### Expected behaviour
Playwright test should open SettingsModal, toggle Bloom and Vignette switches, and verify post-processing state updates without console errors.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/Bloom.test.ts`.
- [ ] Toggle Bloom graphics switch in SettingsModal.
- [ ] Assert post-processing state updates cleanly.

### Likely files/components affected
- `tests/e2e/Bloom.test.ts`
- `src/components/PostProcessing.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for Keplerian orbit trajectory rendering in OrbitVisualizer.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/OrbitVisualizer.test.ts` is a 135-byte stub file. AstroDex lacks automated E2E tests verifying 3D Keplerian orbit ellipses render when selecting objects.

### Why it matters
Orbit visualizer lines show trajectories. E2E tests confirm orbit line geometry updates when selecting different catalog asteroids.

### Expected behaviour
Playwright test selects an object from LeftSidebar catalog and asserts 3D orbit line geometry is added to the R3F scene.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/OrbitVisualizer.test.ts`.
- [ ] Select catalog asteroid entry.
- [ ] Assert selected orbit line renders around Earth.

### Likely files/components affected
- `tests/e2e/OrbitVisualizer.test.ts`
- `src/components/OrbitVisualizer.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for user authentication modal and session flows in Auth.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/Auth.test.ts` is a 141-byte stub. Authentication form inputs and login session state lack automated E2E test coverage.

### Why it matters
Authentication is required to claim asteroids. E2E testing ensures login modal forms accept user credentials and manage session state.

### Expected behaviour
Playwright test submits credentials in Auth modal and verifies user authentication state updates in HUD.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/Auth.test.ts`.
- [ ] Test form input entry and validation state.
- [ ] Verify authenticated user badge appears in HUD.

### Likely files/components affected
- `tests/e2e/Auth.test.ts`
- `src/components/Auth.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for Asteroid Inspection panel and telemetry in AsteroidDetail.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/AsteroidDetail.test.ts` is a 145-byte stub file. AstroDex lacks E2E testing for the telemetry inspector panel.

### Why it matters
The telemetry inspector displays velocity, semi-major axis, eccentricity, and claim buttons. E2E tests verify panel data accuracy.

### Expected behaviour
Playwright test selects an object and asserts orbital metrics (velocity km/s, radius km, inclination) render correctly in RightSidebar.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/AsteroidDetail.test.ts`.
- [ ] Verify telemetry panel displays formatted orbital values.
- [ ] Test Close Inspector button action.

### Likely files/components affected
- `tests/e2e/AsteroidDetail.test.ts`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for local storage cache persistence and settings in Cache.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/Cache.test.ts` is a 137-byte stub. AstroDex has no E2E tests checking if user preferences (graphics, theme) persist across browser refreshes.

### Why it matters
User settings saved in localStorage must survive page reloads. E2E tests guarantee settings persistence.

### Expected behaviour
Playwright test modifies a setting (e.g. toggles audio mute), reloads the page, and asserts the preference remains saved in localStorage.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/Cache.test.ts`.
- [ ] Save custom setting and execute page reload.
- [ ] Assert setting persists after reload.

### Likely files/components affected
- `tests/e2e/Cache.test.ts`
- `src/lib/cache.ts`"""
    },
    {
        "title": "Implement Playwright E2E test for global React Error Boundary fallback in ErrorBoundary.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/ErrorBoundary.test.ts` is a 140-byte stub. AstroDex lacks E2E verification of the React Error Boundary fallback screen in real browsers.

### Why it matters
Testing error boundaries in browser environments ensures unhandled exceptions render a user-friendly crash screen rather than a blank page.

### Expected behaviour
Playwright test triggers an artificial component crash and asserts the 'System Recovery' error boundary screen appears with a reload button.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/ErrorBoundary.test.ts`.
- [ ] Assert error boundary message renders on component failure.
- [ ] Verify 'Reload Mission Control' button works.

### Likely files/components affected
- `tests/e2e/ErrorBoundary.test.ts`
- `src/components/ErrorBoundary.tsx`"""
    },
    {
        "title": "Implement Playwright E2E test for AppProvider state initialization in SceneProvider.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Playwright E2E",
        "body": """### Problem
`tests/e2e/SceneProvider.test.ts` is a 144-byte stub file. Global React Context state initialization lacks browser E2E test assertions.

### Why it matters
`AppProvider` supplies global state for orbital objects, active selection, and simulation playback speed. E2E testing ensures initial state hydrators work.

### Expected behaviour
Playwright test launches application and asserts initial catalog objects (600+ items) and default 1x simulation speed load correctly.

### Acceptance criteria
- [ ] Implement E2E test in `tests/e2e/SceneProvider.test.ts`.
- [ ] Verify catalog count matches expected initial dataset length.
- [ ] Confirm simulation playback speed defaults to 1.0.

### Likely files/components affected
- `tests/e2e/SceneProvider.test.ts`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Write security vulnerability report and disclosure policy in docs/SECURITY.md",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / Security",
        "body": """### Problem
`docs/SECURITY.md` is an 83-byte stub file lacking security vulnerability disclosure instructions, supported versions, and reporting contact details.

### Why it matters
A clear `SECURITY.md` policy informs security researchers how to responsibly disclose vulnerabilities without public exposure.

### Expected behaviour
Complete `docs/SECURITY.md` detailing supported versions, reporting email contacts, encryption keys, and response timelines.

### Acceptance criteria
- [ ] Write security disclosure policy in `docs/SECURITY.md`.
- [ ] Detail reporting workflow and expected triage response times.
- [ ] Outline security best practices for Supabase API keys.

### Likely files/components affected
- `docs/SECURITY.md`"""
    },
    {
        "title": "Write developer guide for React state and R3F canvas bridge in docs/state-flow.md",
        "labels": ["gssoc", "level:intermediate", "type:documentation"],
        "category": "Documentation / Architecture",
        "body": """### Problem
`docs/state-flow.md` is a 62-byte stub file. AstroDex lacks architecture documentation explaining how React Context state connects to R3F `useFrame` render loops.

### Why it matters
Documenting the state bridge between React HUD overlays and Three.js canvas loops helps new maintainers extend mission control state safely.

### Expected behaviour
Write architectural guide in `docs/state-flow.md` explaining state flow diagrams, context reducers, and high-frequency `useFrame` buffer updates.

### Acceptance criteria
- [ ] Document React Context -> R3F state bridge in `docs/state-flow.md`.
- [ ] Include Mermaid sequence diagram showing selection state updates.
- [ ] Detail performance guidelines for avoiding React re-renders in `useFrame`.

### Likely files/components affected
- `docs/state-flow.md`"""
    },
    {
        "title": "Implement Web Audio API space ambient sound synthesizer in src/components/AudioPlayer.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / Audio Feature",
        "body": """### Problem
`AudioPlayer.tsx` is an incomplete stub. AstroDex lacks procedural ambient space audio or UI button click sound effects.

### Why it matters
Subtle procedural Web Audio API space hums and futuristic button click chimes heighten visual immersion.

### Expected behaviour
Implement a lightweight Web Audio API sound generator in `AudioPlayer.tsx` generating low-frequency space hums and click sound effects.

### Acceptance criteria
- [ ] Implement procedural Web Audio synthesizer in `AudioPlayer.tsx`.
- [ ] Add ambient low hum oscillator and UI button click chime.
- [ ] Provide mute toggle in SettingsModal and respect user audio settings.

### Likely files/components affected
- `src/components/AudioPlayer.tsx`
- `src/components/SettingsModal.tsx`"""
    },
    {
        "title": "Implement procedural texture loading progress overlay in src/components/TextureLoaderProgress.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Loading Experience",
        "body": """### Problem
`TextureLoaderProgress.tsx` is a stub file. When Canvas 2D textures (Earth elevation, specular, cloud maps) generate on startup, users see a static spinner without percent progress.

### Why it matters
Displaying texture generation percentage progress gives users feedback during startup asset preparation.

### Expected behaviour
Render a percentage progress bar (0% to 100%) in `TextureLoaderProgress.tsx` during procedural texture canvas rendering steps.

### Acceptance criteria
- [ ] Implement progress bar component in `src/components/TextureLoaderProgress.tsx`.
- [ ] Track procedural canvas texture generation completion.
- [ ] Smoothly transition to 3D scene upon 100% completion.

### Likely files/components affected
- `src/components/TextureLoaderProgress.tsx`
- `src/components/earth/textures.ts`"""
    },
    {
        "title": "Implement Hohmann orbit transfer trajectory calculator and visualizer in OrbitTransferCalculator.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / Orbital Mechanics Feature",
        "body": """### Problem
`OrbitTransferCalculator.tsx` is an 88-byte stub. Operators cannot compute or visualize Hohmann transfer orbits (delta-V maneuver trajectories) between two orbital objects.

### Why it matters
Hohmann transfer calculations represent core orbital mechanics physics, allowing users to plan orbital transfer burns between orbits.

### Expected behaviour
Compute transfer delta-V (km/s) and render a semi-elliptical transfer trajectory arc between selected orbit $r_1$ and target orbit $r_2$.

### Acceptance criteria
- [ ] Implement Hohmann math calculation in `OrbitTransferCalculator.tsx`.
- [ ] Render 3D transfer orbit arc geometry.
- [ ] Display required total $\\Delta V$ readout in RightSidebar.

### Likely files/components affected
- `src/components/OrbitTransferCalculator.tsx`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement LEO space debris cloud instanced mesh in src/components/DebrisField.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / Instancing",
        "body": """### Problem
`DebrisField.tsx` is a 79-byte stub file. AstroDex lacks Low Earth Orbit (LEO) space junk / debris field rendering.

### Why it matters
Rendering LEO debris clouds visualizes space situational awareness and space debris crowding around satellite orbits.

### Expected behaviour
Render 200+ micro debris particle instances on crowded LEO orbits using `<InstancedMesh>` in `DebrisField.tsx`.

### Acceptance criteria
- [ ] Create `DebrisField.tsx` using R3F `<InstancedMesh>`.
- [ ] Generate random LEO debris orbits ($a \\in [6600, 7200]$ km).
- [ ] Add HUD toggle in LeftSidebar catalog filters.

### Likely files/components affected
- `src/components/DebrisField.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement Geostationary Orbit GEO ring visualizer in src/components/GeostationaryRing.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Visualization",
        "body": """### Problem
`GeostationaryRing.tsx` is an 84-byte stub. Operators cannot see a visual indicator ring marking the Geostationary Earth Orbit (GEO) belt at 35,786 km altitude.

### Why it matters
Visualizing the GEO equatorial belt helps users understand satellite orbital slots and geostationary orbital mechanics.

### Expected behaviour
Render a translucent 3D ring at 42,164 km geocentric radius ($a = 42164$ km, $i = 0^\\circ$) in `GeostationaryRing.tsx`.

### Acceptance criteria
- [ ] Create translucent ring mesh in `GeostationaryRing.tsx` at GEO altitude.
- [ ] Add GEO belt toggle switch in HUD settings.
- [ ] Display GEO satellite slot markers.

### Likely files/components affected
- `src/components/GeostationaryRing.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement solar flare space weather warning HUD banner in src/components/SolarFlareAlert.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / Telemetry Feature",
        "body": """### Problem
`SolarFlareAlert.tsx` is an 81-byte stub. AstroDex does not simulate space weather events (solar radiation flares) affecting satellite communications.

### Why it matters
Space weather alerts simulate real-world space environmental hazards impacting orbital satellite operations.

### Expected behaviour
Periodically trigger simulated solar flare radiation events displaying a top HUD alert banner in `SolarFlareAlert.tsx`.

### Acceptance criteria
- [ ] Create space weather alert banner in `SolarFlareAlert.tsx`.
- [ ] Display flare intensity class (M-Class, X-Class).
- [ ] Log space weather event to AgentTerminal.

### Likely files/components affected
- `src/components/SolarFlareAlert.tsx`
- `src/components/AgentTerminal.tsx`"""
    },
    {
        "title": "Implement Earth Lagrange Points L1 L5 3D visualizer in OrbitalResonance.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / Celestial Mechanics",
        "body": """### Problem
`OrbitalResonance.tsx` is an 86-byte stub file. AstroDex lacks 3D point markers for the five Earth-Sun / Earth-Moon Lagrange equilibrium points ($L_1 \\dots L_5$).

### Why it matters
Lagrange points are gravitationally stable orbital locations used by space telescopes (JWST at $L_2$). Visualizing them is highly educational.

### Expected behaviour
Render 3D marker icons and labels for Lagrange points $L_1, L_2, L_3, L_4, L_5$ in `OrbitalResonance.tsx`.

### Acceptance criteria
- [ ] Calculate relative 3D positions for $L_1 \\dots L_5$.
- [ ] Render 3D point markers and text labels in scene.
- [ ] Include tooltip descriptions for each Lagrange point.

### Likely files/components affected
- `src/components/OrbitalResonance.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement Earth ground tracking station dish markers in src/components/GroundStation.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Earth Visualization",
        "body": """### Problem
`GroundStation.tsx` is an 83-byte stub file. The 3D Earth globe does not display ground tracking station dish markers (Goldstone, Madrid, Canberra).

### Why it matters
Ground tracking stations illustrate how deep space communication networks maintain contact with Earth satellites.

### Expected behaviour
Render 3D satellite dish icons on Earth's surface at major Deep Space Network (DSN) geographic coordinates.

### Acceptance criteria
- [ ] Define latitude/longitude coordinates for DSN ground stations in `GroundStation.tsx`.
- [ ] Project lat/long onto 3D Earth sphere surface.
- [ ] Draw line of sight vectors to active selected satellites.

### Likely files/components affected
- `src/components/GroundStation.tsx`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Create Supabase Edge Function for real-time orbital conjunction alerts",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "Backend / Supabase Edge Functions",
        "body": """### Problem
Conjunction detection currently evaluates locally on client browsers. AstroDex lacks a backend Supabase Edge Function to evaluate conjunction risks asynchronously.

### Why it matters
A serverless Edge Function evaluates conjunctions continuously and dispatches real-time WebSocket notifications to connected clients.

### Expected behaviour
Create Deno TypeScript Edge Function in `supabase/functions/conjunction-alert/index.ts` processing orbit conjunctions.

### Acceptance criteria
- [ ] Create `supabase/functions/conjunction-alert/index.ts`.
- [ ] Implement orbit distance matrix evaluation algorithm.
- [ ] Deploy Edge Function configuration in `supabase/config.toml`.

### Likely files/components affected
- `supabase/functions/conjunction-alert/index.ts`
- `supabase/config.toml`"""
    },
    {
        "title": "Create Supabase Edge Function for daily leaderboard rewards in index.ts",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Backend / Supabase Edge Functions",
        "body": """### Problem
Leaderboard score updates are calculated client-side without automated daily serverless cron aggregation.

### Why it matters
Serverless cron functions prevent leaderboard tampering and handle daily mining claim reward distribution automatically.

### Expected behaviour
Create Supabase Edge Function `supabase/functions/daily-leaderboard/index.ts` aggregating top user mining claims daily.

### Acceptance criteria
- [ ] Create Edge Function in `supabase/functions/daily-leaderboard/index.ts`.
- [ ] Aggregate claim counts and user mining ranks.
- [ ] Update leaderboard table in Supabase.

### Likely files/components affected
- `supabase/functions/daily-leaderboard/index.ts`"""
    },
    {
        "title": "Create internationalization JSON schemas for English, Spanish, and Mandarin in public/locales/",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "Refactoring / i18n",
        "body": """### Problem
`public/locales/` contains stub files. AstroDex lacks translation JSON dictionaries for internationalization (i18n).

### Why it matters
Providing multi-language support (English, Spanish, Mandarin) makes AstroDex accessible to a global audience.

### Expected behaviour
Create `public/locales/en.json`, `public/locales/es.json`, and `public/locales/zh.json` containing HUD UI key translations.

### Acceptance criteria
- [ ] Create `en.json`, `es.json`, and `zh.json` in `public/locales/`.
- [ ] Define translation strings for Header, Catalog, Telemetry, and Settings.
- [ ] Validate JSON syntax across locale files.

### Likely files/components affected
- `public/locales/en.json`
- `public/locales/es.json`
- `public/locales/zh.json`"""
    },
    {
        "title": "Implement i18n translation context provider in src/lib/i18n.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Refactoring / i18n",
        "body": """### Problem
`src/lib/i18n.tsx` is an incomplete stub file. AstroDex lacks a React Context provider for switching active UI translation languages.

### Why it matters
A lightweight i18n context provider allows HUD components to consume localized strings via a simple `useTranslation()` hook.

### Expected behaviour
Implement `I18nProvider` and `useTranslation()` hook in `src/lib/i18n.tsx` supporting locale switching.

### Acceptance criteria
- [ ] Implement `I18nProvider` loading translation dictionary files.
- [ ] Export `useTranslation()` returning typed `t(key)` helper.
- [ ] Add language select dropdown in SettingsModal.

### Likely files/components affected
- `src/lib/i18n.tsx`
- `src/components/SettingsModal.tsx`"""
    },
    {
        "title": "Add WebGL context loss recovery handler in src/components/Scene.tsx",
        "labels": ["gssoc", "level:advanced", "type:bug"],
        "category": "3D / Reliability Bug",
        "body": """### Problem
If the GPU driver crashes or browser tab loses WebGL context, R3F Canvas fails silently and leaves a black screen without attempting context restoration.

### Why it matters
Handling `webglcontextlost` and `webglcontextrestored` events prevents application freezing on lower-end devices or GPU driver restarts.

### Expected behaviour
`Scene.tsx` should attach WebGL context loss listeners, pausing rendering on loss and restoring 3D meshes upon context recovery.

### Acceptance criteria
- [ ] Add `webglcontextlost` event listener in `Scene.tsx`.
- [ ] Display 'Re-initializing WebGL...' recovery overlay.
- [ ] Restore procedural textures and R3F scene on `webglcontextrestored`.

### Likely files/components affected
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement camera FOV zoom transition on object double click in CameraController.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "3D / UX Enhancement",
        "body": """### Problem
Double-clicking an asteroid in the catalog or 3D scene selects the object but does not trigger a smooth camera FOV zoom animation.

### Why it matters
A cinematic FOV zoom transition on double-click provides satisfying visual focus when inspecting individual space objects.

### Expected behaviour
Animate camera Field of View (FOV) from 60° to 35° smoothly during target inspection transitions in `CameraController.tsx`.

### Acceptance criteria
- [ ] Add double-click interaction handler to object target state.
- [ ] Lerp camera FOV dynamically in `useFrame`.
- [ ] Reset FOV to 60° when clearing selection.

### Likely files/components affected
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Add procedural asteroid surface texture variation in textures.ts",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Textures",
        "body": """### Problem
Procedural asteroid textures rendered in Canvas 2D use uniform noise patterns without surface crater or ridge variations.

### Why it matters
Generating diverse surface bump maps and crater patterns adds realism to rendered 3D asteroid geometries.

### Expected behaviour
Enhance procedural canvas texture rendering in `textures.ts` with procedural crater shapes and crater rim heightmaps.

### Acceptance criteria
- [ ] Add procedural crater generation functions in `textures.ts`.
- [ ] Generate unique normal maps per asteroid type (C-type carbonaceous, S-type stony, M-type metallic).
- [ ] Verify texture performance.

### Likely files/components affected
- `src/components/earth/textures.ts`"""
    },
    {
        "title": "Implement orbit inclination and eccentricity filters in LeftSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Catalog Filtering",
        "body": """### Problem
`LeftSidebar.tsx` allows filtering by text query but lacks range sliders for filtering asteroids by inclination ($i$) or eccentricity ($e$).

### Why it matters
Advanced orbital filtering allows operators to filter high-inclination orbits or highly eccentric trajectories easily.

### Expected behaviour
Add min/max range sliders for inclination angle (0° to 90°) and eccentricity (0 to 1) in `LeftSidebar.tsx`.

### Acceptance criteria
- [ ] Add inclination and eccentricity slider controls in `LeftSidebar.tsx`.
- [ ] Filter catalog array according to active range thresholds.
- [ ] Debounce slider updates for smooth UI rendering.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Add automated WebGL context loss unit test in tests/unit/webgl.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / 3D",
        "body": """### Problem
There are zero unit tests asserting that WebGL context loss handlers cleanup event listeners and state cleanly.

### Why it matters
Unit testing WebGL lifecycle events prevents memory leaks when canvas elements unmount or re-render.

### Expected behaviour
Write Vitest unit test in `tests/unit/webgl.test.ts` dispatching synthetic `webglcontextlost` events on a canvas instance.

### Acceptance criteria
- [ ] Create `tests/unit/webgl.test.ts`.
- [ ] Dispatch synthetic context loss event.
- [ ] Assert state handler sets paused rendering flag.

### Likely files/components affected
- `tests/unit/webgl.test.ts`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement orbital velocity vector arrow indicator in OrbitVisualizer.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Telemetry Visualization",
        "body": """### Problem
`OrbitVisualizer.tsx` draws the orbit trajectory ellipse but does not display a 3D velocity vector arrow ($\\\\vec{v}$) showing motion direction.

### Why it matters
A velocity vector arrow vividly shows orbital speed magnitude and instantaneous direction of travel at any point in orbit.

### Expected behaviour
Render a 3D directional arrow helper (`ArrowHelper`) at the selected object's position pointing in the direction of instantaneous velocity vector $\\\\vec{v}$.

### Acceptance criteria
- [ ] Compute instantaneous velocity vector $\\\\vec{v}$ in `kepler.ts`.
- [ ] Render 3D arrow helper in `OrbitVisualizer.tsx`.
- [ ] Scale arrow length proportionally to Vis-Viva speed.

### Likely files/components affected
- `src/components/OrbitVisualizer.tsx`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement custom mouse cursor space crosshair in globals.css",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Styling",
        "body": """### Problem
Hovering over the 3D space viewport displays the standard operating system mouse pointer instead of a futuristic sci-fi target crosshair cursor.

### Why it matters
A subtle custom target crosshair cursor enhances the space mission control theme.

### Expected behaviour
Define custom SVG cursor CSS rules (`cursor: url('/cursors/crosshair.svg'), crosshair`) for the 3D Canvas viewport container in `globals.css`.

### Acceptance criteria
- [ ] Create custom crosshair cursor SVG in `public/cursors/crosshair.svg`.
- [ ] Apply CSS cursor rule to canvas container in `globals.css`.
- [ ] Ensure standard cursor restores over HTML sidebar buttons.

### Likely files/components affected
- `src/app/globals.css`
- `public/cursors/crosshair.svg`"""
    },
    {
        "title": "Add keyboard shortcut F to focus search palette",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / Keybindings",
        "body": """### Problem
Pressing `F` key while viewing the HUD does not focus the catalog search input field in LeftSidebar.

### Why it matters
Single-key shortcuts (`F` for Find) improve speed for keyboard operators managing mission control lists.

### Expected behaviour
Pressing `F` key (when no input is focused) shifts focus directly to the catalog search input in `LeftSidebar.tsx`.

### Acceptance criteria
- [ ] Add `F` keydown listener in `KeyboardNavigation.tsx`.
- [ ] Focus search input ref in `LeftSidebar.tsx`.
- [ ] Ignore keypress when typing inside form inputs.

### Likely files/components affected
- `src/components/KeyboardNavigation.tsx`
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Add automated TypeScript build check to pre commit git hooks in husky",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / CI Tooling",
        "body": """### Problem
Contributors can commit broken TypeScript code locally without running `npm run typecheck` beforehand, leading to broken CI builds on pull requests.

### Why it matters
Pre-commit git hooks block commits containing TypeScript syntax or compilation errors before they reach GitHub.

### Expected behaviour
Configure `.husky/pre-commit` to execute `npm run typecheck` and `npm run lint` before allowing git commits.

### Acceptance criteria
- [ ] Install and configure `.husky/pre-commit`.
- [ ] Add `npm run typecheck` check step.
- [ ] Test git commit rejection when syntax errors exist.

### Likely files/components affected
- `.husky/pre-commit`
- `package.json`"""
    },
    {
        "title": "Implement screenshot capture button exporting high res 3D canvas PNG in Header.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / Feature",
        "body": """### Problem
Users viewing a beautiful Earth or asteroid orbit alignment cannot export or download a high-resolution PNG image of the 3D scene.

### Why it matters
A screenshot export feature lets users share mission control snapshots on social media and documentation.

### Expected behaviour
Add a 'Capture Snapshot' camera button in `Header.tsx` triggering `canvas.toDataURL('image/png')` and downloading the image.

### Acceptance criteria
- [ ] Add camera snapshot button in `Header.tsx`.
- [ ] Preserve WebGL drawing buffer (`preserveDrawingBuffer: true`).
- [ ] Download PNG snapshot with timestamped file name (`astrodex-snapshot-2026.png`).

### Likely files/components affected
- `src/components/Header.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Add orbital energy calculation in kepler.ts",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "Orbital Mechanics / Physics",
        "body": """### Problem
`src/lib/kepler.ts` calculates Vis-Viva speed but does not export specific orbital energy equation $E = -\\frac{\\mu}{2a}$.

### Why it matters
Specific orbital energy is a fundamental Keplerian parameter quantifying gravitational binding energy of an orbit.

### Expected behaviour
Export `orbitalEnergy(a: number): number` and `orbitalEnergyJoules(aKm: number, massKg: number): number` in `src/lib/kepler.ts`.

### Acceptance criteria
- [ ] Implement `orbitalEnergy` in `src/lib/kepler.ts`.
- [ ] Write unit tests asserting energy outputs for circular and elliptical orbits.
- [ ] Display energy metric in RightSidebar telemetry inspector.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Add unit tests for orbital energy equations in kepler.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Math",
        "body": """### Problem
Specific orbital energy equations lack dedicated unit tests asserting boundary condition outputs for zero or negative semi-major axes.

### Why it matters
Unit testing math helpers prevents regressions when physics formulas are refactored.

### Expected behaviour
Add test assertions in `tests/kepler.test.ts` verifying `orbitalEnergy` values for LEO ($a = 6700$ km) and GEO ($a = 42164$ km) altitudes.

### Acceptance criteria
- [ ] Write unit tests for `orbitalEnergy` in `tests/kepler.test.ts`.
- [ ] Assert correct negative energy outputs for bound orbits.
- [ ] Verify test suite passes with `npm run test`.

### Likely files/components affected
- `tests/kepler.test.ts`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Refactor Atmosphere.tsx shader to support custom sky twilight color parameters",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "3D / Shaders",
        "body": """### Problem
Atmospheric scattering shader colors in `Atmosphere.tsx` use hardcoded GLSL vec3 RGB values for blue Rayleigh scattering.

### Why it matters
Exposing twilight atmosphere colors via R3F material uniforms allows custom theme modes (sunset orange atmosphere, alien green atmosphere).

### Expected behaviour
Refactor `Atmosphere.tsx` shader material uniforms to accept `uAtmosphereColor` and `uAtmosphereIntensity` props dynamically.

### Acceptance criteria
- [ ] Add `uAtmosphereColor` uniform to GLSL fragment shader in `Atmosphere.tsx`.
- [ ] Bind uniform to context settings.
- [ ] Verify atmospheric glow updates dynamically.

### Likely files/components affected
- `src/components/earth/Atmosphere.tsx`"""
    },
    {
        "title": "Implement night side Earth city lights procedural shader texture in textures.ts",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / Earth Shader",
        "body": """### Problem
The dark night side of Earth appears pitch black without procedural city lights / night illumination textures.

### Why it matters
Night-side city light emissions make 3D Earth rendering look realistic and visually stunning.

### Expected behaviour
Generate a procedural night-lights emissive canvas texture in `textures.ts` and blend it into Earth shader on night-side fragments.

### Acceptance criteria
- [ ] Generate procedural night city lights canvas map in `textures.ts`.
- [ ] Blend emissive night texture in `Earth.tsx` shader based on sun light dot product ($N \\cdot L < 0$).
- [ ] Verify 60 fps Earth render performance.

### Likely files/components affected
- `src/components/earth/textures.ts`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Add animated cloud layer drift rotation in CloudLayer.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "3D / Earth Animation",
        "body": """### Problem
The atmospheric cloud sphere mesh in `CloudLayer.tsx` remains static relative to Earth's rotation.

### Why it matters
Animating cloud layer rotation at a slightly different speed than Earth's surface rotation produces realistic atmospheric motion.

### Expected behaviour
Apply slow, independent angular rotation to the CloudLayer mesh inside `useFrame` loop in `CloudLayer.tsx`.

### Acceptance criteria
- [ ] Add slow Y-axis rotation in `CloudLayer.tsx` `useFrame`.
- [ ] Ensure cloud rotation speed is distinct from Earth surface rotation.
- [ ] Verify smooth frame performance.

### Likely files/components affected
- `src/components/earth/CloudLayer.tsx`"""
    },
    {
        "title": "Implement CSV catalog export button in LeftSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Data Export",
        "body": """### Problem
Users inspecting the catalog cannot export filtered list data to a CSV file for offline scientific analysis.

### Why it matters
Data export features allow researchers and students to analyze orbital parameters in spreadsheet tools (Excel, Google Sheets).

### Expected behaviour
Add an 'Export CSV' button in `LeftSidebar.tsx` generating a downloadable `astrodex-catalog.csv` file.

### Acceptance criteria
- [ ] Add Export CSV button in `LeftSidebar.tsx`.
- [ ] Format active catalog items into CSV string (ID, Name, Radius, Eccentricity, Velocity).
- [ ] Trigger automatic browser file download.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Implement JSON telemetry log export in AgentTerminal.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Feature",
        "body": """### Problem
`AgentTerminal.tsx` displays mission telemetry logs, but lacks a button to export active terminal logs to a JSON file.

### Why it matters
Exporting logs allows operators to archive mission control telemetry and conjunction alert histories.

### Expected behaviour
Add an 'Export Logs' button in `AgentTerminal.tsx` downloading `terminal-logs.json`.

### Acceptance criteria
- [ ] Add Export Logs button to `AgentTerminal.tsx`.
- [ ] Serialize log entries array to formatted JSON.
- [ ] Trigger browser file download.

### Likely files/components affected
- `src/components/AgentTerminal.tsx`"""
    },
    {
        "title": "Add tooltips for simulation playback speed controls in Header.tsx",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / Tooltips",
        "body": """### Problem
Simulation playback speed buttons (0.5x, 1x, 5x, 10x, Pause) in `Header.tsx` lack descriptive ARIA labels and hover tooltips.

### Why it matters
Screen readers and mouse users need context explaining simulation speed controls.

### Expected behaviour
Wrap playback speed buttons in `Header.tsx` with accessible `<Tooltip>` components and `aria-label` attributes.

### Acceptance criteria
- [ ] Add `aria-label` attributes to playback speed buttons in `Header.tsx`.
- [ ] Provide tooltips (\"Set simulation speed to 5x real-time\").
- [ ] Verify accessibility compliance.

### Likely files/components affected
- `src/components/Header.tsx`
- `src/components/Tooltip.tsx`"""
    },
    {
        "title": "Add automated ESLint fix command npm run lint fix to package.json",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Tooling",
        "body": """### Problem
`package.json` includes `"lint": "next lint"` but lacks a convenient `"lint:fix"` script command to automatically fix format and lint warnings.

### Why it matters
An automated `"lint:fix"` command speeds up developer workflows by auto-correcting fixable ESLint warnings.

### Expected behaviour
Add `"lint:fix": "next lint --fix"` to `"scripts"` object in `package.json`.

### Acceptance criteria
- [ ] Add `"lint:fix": "next lint --fix"` to `package.json`.
- [ ] Test script execution locally.

### Likely files/components affected
- `package.json`"""
    },
    {
        "title": "Implement orbital inclination angle filtering slider in LeftSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Filtering",
        "body": """### Problem
Users cannot isolate asteroids orbiting at specific inclination angles (e.g. equatorial vs polar orbits).

### Why it matters
Inclination filtering enables space situational analysis of specific orbital planes.

### Expected behaviour
Add an inclination range slider (0° to 90°) in `LeftSidebar.tsx` filtering the visible 3D orbital object catalog.

### Acceptance criteria
- [ ] Add inclination slider to `LeftSidebar.tsx`.
- [ ] Filter catalog items based on inclination angle $i$.
- [ ] Update visible 3D asteroid instances dynamically.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/components/AsteroidField.tsx`"""
    },
    {
        "title": "Add procedural Earth ocean specular reflection map in textures.ts",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Textures",
        "body": """### Problem
Earth rendering lacks a specular reflection map, causing land masses and ocean bodies to reflect sunlight with identical glossiness.

### Why it matters
A procedural ocean specular map ensures water bodies glisten realistically under sunlight while continents remain matte.

### Expected behaviour
Generate a procedural 2D ocean mask specular texture in `textures.ts` and pass it to `Earth.tsx` shader.

### Acceptance criteria
- [ ] Generate specular mask canvas map in `textures.ts`.
- [ ] Bind specular map uniform in `Earth.tsx`.
- [ ] Verify ocean sunlight reflection highlights.

### Likely files/components affected
- `src/components/earth/textures.ts`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Implement satellite mission operational status badge in RightSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Telemetry",
        "body": """### Problem
When inspecting active satellites (ISS, Hubble, Starlink), `RightSidebar.tsx` does not display an operational status badge (Nominal, Orbit Decay, Critical).

### Why it matters
Status badges communicate satellite health state quickly to operators.

### Expected behaviour
Display a color-coded status badge (Green = Nominal, Amber = Decay Warning, Red = Critical) in `RightSidebar.tsx`.

### Acceptance criteria
- [ ] Add mission status badge component in `RightSidebar.tsx`.
- [ ] Derive status from satellite decay altitude.
- [ ] Provide accessible status text.

### Likely files/components affected
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Add dark space gradient background fallback when WebGL fails to load",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / Reliability",
        "body": """### Problem
If WebGL context creation fails on unsupported hardware, the canvas container displays a white background rectangle.

### Why it matters
A dark space gradient fallback maintains visual aesthetic even when 3D WebGL acceleration is unavailable.

### Expected behaviour
Apply a dark space CSS background gradient fallback (`bg-radial from-slate-950 to-black`) behind the 3D Canvas container.

### Acceptance criteria
- [ ] Add CSS background styling to canvas container wrapper in `Scene.tsx`.
- [ ] Verify fallback background renders cleanly on WebGL failure.

### Likely files/components affected
- `src/components/Scene.tsx`
- `src/app/globals.css`"""
    },
    {
        "title": "Implement smooth camera reset animation when pressing Escape key",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "3D / Controls",
        "body": """### Problem
Pressing `Escape` key closes active modals but does not clear object selection or reset camera focus back to default overview coordinates.

### Why it matters
Using `Escape` to dismiss object selection and reset camera view is standard 3D navigation UX.

### Expected behaviour
Pressing `Escape` key should clear selected object target and trigger camera lerp back to home position `(0, 0, 0)`.

### Acceptance criteria
- [ ] Add `Escape` key listener in `KeyboardNavigation.tsx`.
- [ ] Unselect target object in `store.tsx`.
- [ ] Lerp camera back to initial overview coordinates.

### Likely files/components affected
- `src/components/KeyboardNavigation.tsx`
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Add automated Dependabot vulnerability alert configuration in dependabot.yml",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Security Automation",
        "body": """### Problem
`.github/dependabot.yml` is missing or incomplete, preventing GitHub Dependabot from automatically opening security fix PRs for vulnerable dependencies.

### Why it matters
Automated security updates ensure npm dependencies remain patched against known security vulnerabilities.

### Expected behaviour
Create `.github/dependabot.yml` configured to check npm and GitHub Actions package updates weekly.

### Acceptance criteria
- [ ] Create `.github/dependabot.yml`.
- [ ] Configure `package-ecosystem: \"npm\"` and `package-ecosystem: \"github-actions\"`.
- [ ] Set weekly update schedules.

### Likely files/components affected
- `.github/dependabot.yml`"""
    },
    {
        "title": "Create comprehensive WebGL troubleshooting guide in docs/TROUBLESHOOTING.md",
        "labels": ["gssoc", "level:intermediate", "type:documentation"],
        "category": "Documentation / Troubleshooting",
        "body": """### Problem
`docs/TROUBLESHOOTING.md` lacks detailed solutions for WebGL hardware acceleration issues, canvas context loss, and high DPI performance drops.

### Why it matters
A detailed troubleshooting guide helps users and contributors resolve browser WebGL graphics issues independently.

### Expected behaviour
Expand `docs/TROUBLESHOOTING.md` with sections covering Chrome WebGL flags, GPU driver updates, context loss recovery, and mobile performance settings.

### Acceptance criteria
- [ ] Update `docs/TROUBLESHOOTING.md` with step-by-step resolution guides.
- [ ] Add sections for WebGL context loss, slow framerates, and memory leaks.
- [ ] Verify markdown formatting and links.

### Likely files/components affected
- `docs/TROUBLESHOOTING.md`"""
    }
]

print(f"Total proposed Batch 4 issues: {len(batch4_issues)}")

created_count = 0
dup_count = 0
for idx, issue in enumerate(batch4_issues, 151):
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
    
    print(f"[{idx}/200] Creating issue: {issue['title']} (Labels: {issue['labels']})")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        created_count += 1
        existing_titles.add(t_lower)
        print(f"  -> Created successfully: {res.stdout.strip()}")
    else:
        print(f"  -> Failed: {res.stderr.strip()}")
    time.sleep(0.5)

print(f"\nBatch 4 Summary: Created {created_count} issues. Skipped {dup_count} duplicates.")
