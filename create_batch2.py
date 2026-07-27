import json
import subprocess
import time
import sys

# Load existing issue titles to avoid duplicate titles
with open("existing_titles.json", "r") as f:
    existing_titles = set(json.load(f))

batch2_issues = [
    {
        "title": "Implement Web Worker offloading for real-time spatial conjunction detection",
        "labels": ["gssoc", "level:advanced", "type:performance"],
        "category": "Performance / Web Workers",
        "body": """### Problem
`src/workers/conjunctionWorker.ts` is currently an empty 77-byte stub. Real-time spatial conjunction detection performs $O(N^2)$ pairwise distance checks across 600+ orbital objects on the main thread, causing severe UI frame drops.

### Why it matters
Executing heavy $O(N^2)$ collision checks on the main JavaScript thread blocks user interactions and degrades 3D canvas framerates on lower-end devices.

### Expected behaviour
`conjunction.worker.ts` should offload distance calculations to a background Web Worker, returning an array of close-approach object IDs to the main thread asynchronously.

### Acceptance criteria
- [ ] Implement array buffer passing to `src/workers/conjunction.worker.ts`.
- [ ] Calculate pairwise distances between asteroids and active satellites in worker thread.
- [ ] Post conjunction alert payloads back to `store.tsx` without main-thread blocking.

### Likely files/components affected
- `src/workers/conjunction.worker.ts`
- `src/lib/conjunction.ts`
- `src/hooks/useOrbitalObjects.ts`"""
    },
    {
        "title": "Implement Web Worker offloading for Keplerian orbit solver loop",
        "labels": ["gssoc", "level:advanced", "type:performance"],
        "category": "Performance / Web Workers",
        "body": """### Problem
`src/workers/keplerWorker.ts` is a 80-byte stub file. Newton-Raphson Keplerian orbit calculations for 600+ asteroids run per frame on the main UI thread.

### Why it matters
Offloading expensive iterative mathematical equations to a worker pipeline keeps the main thread dedicated to R3F rendering and 60 fps camera movement.

### Expected behaviour
`keplerWorker.ts` should compute positions for orbital instances in parallel using typed `Float32Array` buffers.

### Acceptance criteria
- [ ] Implement `keplerWorker.ts` to solve $M = E - e\\sin(E)$ for batch orbital data.
- [ ] Transfer position array buffers using `SharedArrayBuffer` or Transferable Objects.
- [ ] Verify R3F scene performance increases under heavy load.

### Likely files/components affected
- `src/workers/keplerWorker.ts`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement custom useDebounce hook in src/hooks/useDebounce.ts",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Custom Hooks",
        "body": """### Problem
Search input filtering and rapid UI updates across sidebar panels currently lack a centralized, reusable debouncing hook.

### Why it matters
Duplicating ad-hoc `setTimeout` logic across components leads to memory leaks and un-cleared timer IDs.

### Expected behaviour
Create a generic `useDebounce<T>(value: T, delay: number): T` hook in `src/hooks/useDebounce.ts`.

### Acceptance criteria
- [ ] Implement `useDebounce` hook with automatic cleanup on unmount.
- [ ] Provide TypeScript generics for arbitrary state value debouncing.
- [ ] Export hook for use in `LeftSidebar.tsx` and search modals.

### Likely files/components affected
- `src/hooks/useDebounce.ts`"""
    },
    {
        "title": "Implement custom usePrefersReducedMotion hook in src/hooks/usePrefersReducedMotion.ts",
        "labels": ["gssoc", "level:beginner", "type:accessibility"],
        "category": "Accessibility / Custom Hooks",
        "body": """### Problem
`src/hooks/` lacks a standard hook to detect the user's OS preference for reduced motion (`prefers-reduced-motion: reduce`).

### Why it matters
Users with vestibular motion disorders require immediate disabling of aggressive 3D camera sweeps and camera lerp transitions.

### Expected behaviour
`usePrefersReducedMotion` should listen to `window.matchMedia('(prefers-reduced-motion: reduce)')` and return a boolean state.

### Acceptance criteria
- [ ] Implement `usePrefersReducedMotion` hook with `change` event listener.
- [ ] Integrate hook with `CameraController.tsx` to instantly disable camera lerps when reduced motion is preferred.
- [ ] Handle SSR safety (check for `window` availability).

### Likely files/components affected
- `src/hooks/usePrefersReducedMotion.ts`
- `src/components/CameraController.tsx`"""
    },
    {
        "title": "Extract custom useOrbitGeometry hook to decouple orbit trail math from OrbitVisualizer",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Refactoring / 3D Geometry",
        "body": """### Problem
`OrbitVisualizer.tsx` calculates 3D ellipse vertex points inline inside component render functions instead of leveraging a reusable geometry hook.

### Why it matters
Mixing 3D curve mathematical generation with JSX mesh component rendering makes orbit visualization difficult to reuse and test.

### Expected behaviour
Extract ellipse vertex calculation into a custom `useOrbitGeometry(a, e, inclination)` hook returning a `THREE.BufferGeometry`.

### Acceptance criteria
- [ ] Create `src/hooks/useOrbitGeometry.ts`.
- [ ] Memoize `BufferGeometry` generation based on orbital element inputs.
- [ ] Refactor `OrbitVisualizer.tsx` to consume `useOrbitGeometry`.

### Likely files/components affected
- `src/hooks/useOrbitGeometry.ts`
- `src/components/OrbitVisualizer.tsx`"""
    },
    {
        "title": "Implement custom useToasts hook in src/hooks/useToasts.ts for toast state management",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / UI State",
        "body": """### Problem
`useToasts.ts` is currently a 70-byte stub file. Toast notifications (claims, alerts, errors) are managed via ad-hoc handlers.

### Why it matters
A centralized toast hook provides clean methods (`addToast`, `removeToast`, `clearToasts`) with auto-dismiss timers.

### Expected behaviour
`useToasts.ts` should manage toast notifications array state and expose helper actions.

### Acceptance criteria
- [ ] Implement `useToasts` hook returning active toast stack and dispatcher.
- [ ] Include auto-dismiss timeouts (default 4000ms).
- [ ] Wire `Toasts.tsx` component to `useToasts`.

### Likely files/components affected
- `src/hooks/useToasts.ts`
- `src/components/Toasts.tsx`"""
    },
    {
        "title": "Implement custom useShortcuts hook in src/hooks/useShortcuts.ts for keyboard events",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Refactoring / Keyboard Management",
        "body": """### Problem
`useShortcuts.ts` is an 88-byte placeholder file. Keyboard shortcuts (`?` for help, `Space` for pause, `R` for reset view) are attached manually inside multiple components.

### Why it matters
Centralizing keyboard event registration prevents duplicate key listeners and handles focus suppression in text inputs.

### Expected behaviour
`useShortcuts.ts` should take a map of key combinations to callbacks and handle event registration safely.

### Acceptance criteria
- [ ] Implement `useShortcuts` custom hook accepting shortcut map definitions.
- [ ] Ignore keydown events when focus is inside `<input>`, `<textarea>`, or `<select>`.
- [ ] Clean up event listeners on unmount.

### Likely files/components affected
- `src/hooks/useShortcuts.ts`
- `src/components/KeyboardManager.tsx`"""
    },
    {
        "title": "Implement Web App Manifest in public/manifest.json for PWA installation support",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / PWA Support",
        "body": """### Problem
`public/` lacks a `manifest.json` file. AstroDex cannot be installed as a Progressive Web App (PWA) on desktop or mobile devices.

### Why it matters
A Web App Manifest allows users to install AstroDex to their home screen as a standalone mission control application.

### Expected behaviour
Create `public/manifest.json` with app metadata, theme colors, display modes, and icon references, and link it in `src/app/layout.tsx`.

### Acceptance criteria
- [ ] Create `public/manifest.json` with `name: \"AstroDex — Space Objects Explorer\"`.
- [ ] Set `display: \"standalone\"` and theme colors (`#0f172a`).
- [ ] Add `<link rel=\"manifest\" href=\"/manifest.json\">` in root layout metadata.

### Likely files/components affected
- `public/manifest.json`
- `src/app/layout.tsx`"""
    },
    {
        "title": "Add multi-resolution favicons and Apple Touch Icons in public directory",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Assets",
        "body": """### Problem
`public/` currently lacks `favicon.ico`, `favicon-32x32.png`, and `apple-touch-icon.png` icons, causing browser 404 errors when bookmarking or pinning the app.

### Why it matters
Missing favicons detract from project polish and cause browser console network warnings on initial load.

### Expected behaviour
Provide standard space-themed favicons and apple touch icon assets in `public/` and reference them in Next.js metadata.

### Acceptance criteria
- [ ] Add `public/favicon.ico` and PNG favicons.
- [ ] Add `public/apple-touch-icon.png` (180x180).
- [ ] Configure `icons` in `src/app/layout.tsx` Next.js metadata object.

### Likely files/components affected
- `public/`
- `src/app/layout.tsx`"""
    },
    {
        "title": "Add Open Graph social preview image and Twitter card metadata",
        "labels": ["gssoc", "level:beginner", "type:documentation"],
        "category": "Documentation / SEO",
        "body": """### Problem
Sharing AstroDex links on Twitter, Discord, or LinkedIn renders default text previews because no Open Graph preview image (`og-image.jpg`) is present in `public/`.

### Why it matters
Visually rich Open Graph social cards increase project visibility and community engagement when contributors share their work.

### Expected behaviour
Include `public/og-image.jpg` and configure Open Graph / Twitter Card tags in Next.js App Router metadata API.

### Acceptance criteria
- [ ] Add 1200x630 `public/og-image.jpg` banner asset.
- [ ] Define `openGraph` and `twitter` properties in `src/app/layout.tsx`.
- [ ] Verify social preview tag generation.

### Likely files/components affected
- `public/og-image.jpg`
- `src/app/layout.tsx`"""
    },
    {
        "title": "Implement initial Supabase database schema migration script",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Backend / Supabase Schema",
        "body": """### Problem
`supabase/migrations/20230000_init.sql` is a 70-byte placeholder. The repository lacks a production-ready SQL migration for `claims`, `asteroids`, and `user_profiles`.

### Why it matters
Structured SQL migrations are required for reproducible database deployments and local Supabase CLI development.

### Expected behaviour
Provide a complete migration script creating `asteroids`, `claims`, and `conjunction_logs` tables with appropriate primary keys and foreign key constraints.

### Acceptance criteria
- [ ] Create `supabase/migrations/20260101000000_init_schema.sql`.
- [ ] Define `claims` table with `id`, `asteroid_id`, `user_id`, `claimed_at`.
- [ ] Create index on `asteroid_id` and `user_id`.

### Likely files/components affected
- `supabase/migrations/20260101000000_init_schema.sql`
- `supabase.sql`"""
    },
    {
        "title": "Implement Realtime Supabase websocket subscription hook for live claim updates",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "Backend / Realtime Sync",
        "body": """### Problem
When one user claims an asteroid, other connected clients do not receive real-time updates until a page refresh occurs.

### Why it matters
Real-time claim synchronization across connected users creates an engaging collaborative space simulation experience.

### Expected behaviour
Create `src/hooks/useSupabaseRealtime.ts` subscribing to Supabase Realtime channel postgres_changes on the `claims` table.

### Acceptance criteria
- [ ] Subscribe to `postgres_changes` on table `claims`.
- [ ] Dispatch state updates to `store.tsx` when new claims are inserted or deleted.
- [ ] Clean up channel subscription on component unmount.

### Likely files/components affected
- `src/hooks/useSupabaseRealtime.ts`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Write unit tests for useOrbitalObjects hook in src/hooks/__tests__/useOrbitalObjects.test.ts",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Custom Hooks",
        "body": """### Problem
`src/hooks/useOrbitalObjects.ts` generates orbital object datasets and handles instanced mesh color updates, but lacks unit test coverage.

### Why it matters
Testing custom React hooks ensures data generation and R3F color array updates function reliably across re-renders.

### Expected behaviour
Implement unit tests verifying dataset length (600 objects), property generation, and color mapping.

### Acceptance criteria
- [ ] Use `@testing-library/react` `renderHook` to test `useOrbitalObjects`.
- [ ] Assert 400 asteroids and 200 debris entries generated.
- [ ] Verify all tests pass in Vitest.

### Likely files/components affected
- `src/hooks/__tests__/useOrbitalObjects.test.ts`
- `src/hooks/useOrbitalObjects.ts`"""
    },
    {
        "title": "Write unit tests for custom useDebounce hook in src/hooks/__tests__/useDebounce.test.ts",
        "labels": ["gssoc", "level:beginner", "type:test"],
        "category": "Testing / Custom Hooks",
        "body": """### Problem
The custom `useDebounce` hook requires automated unit tests to verify timer delay execution and cleanup.

### Why it matters
Debounce logic bugs can lead to missed state updates or stale closure references.

### Expected behaviour
Write unit tests using fake timers (`vi.useFakeTimers()`) to verify value updates only occur after specified delay interval.

### Acceptance criteria
- [ ] Test value delay update behavior with `vi.advanceTimersByTime()`.
- [ ] Test timer reset when input value changes rapidly.
- [ ] Confirm clean pass in Vitest.

### Likely files/components affected
- `src/hooks/__tests__/useDebounce.test.ts`
- `src/hooks/useDebounce.ts`"""
    },
    {
        "title": "Write unit tests for conjunction worker spatial calculation routines",
        "labels": ["gssoc", "level:intermediate", "type:test"],
        "category": "Testing / Web Workers",
        "body": """### Problem
Spatial distance checking logic in `conjunction.worker.ts` has zero unit test coverage.

### Why it matters
Conjunction calculations determine risk alerts. Unit testing ensures distance thresholds and risk classifications are mathematically precise.

### Expected behaviour
Write unit tests verifying Euclidean 3D distance calculations between satellite coordinates and asteroid position vectors.

### Acceptance criteria
- [ ] Test 3D distance calculation helper with known vector pairs.
- [ ] Test risk level assignment (`CRITICAL` < 0.2 units, `HIGH` < 0.5 units).
- [ ] Verify test suite execution in Vitest.

### Likely files/components affected
- `src/workers/conjunction.worker.ts`
- `tests/unit/conjunctionWorker.test.ts`"""
    },
    {
        "title": "Implement procedural elevation bump mapping in src/components/earth/textures.ts",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Textures",
        "body": """### Problem
Earth mesh surface currently appears flat under specular lighting because procedural canvas textures lack elevation bump mapping.

### Why it matters
Procedural bump maps add terrain depth to mountain ranges and continental landmasses, significantly raising visual fidelity.

### Expected behaviour
`textures.ts` should generate a procedural grayscale bump map canvas and apply it to the Earth shader material.

### Acceptance criteria
- [ ] Create `createProceduralEarthBumpMap()` in `src/components/earth/textures.ts`.
- [ ] Generate grayscale heightmap noise for continents.
- [ ] Bind bump map uniform to Earth shader.

### Likely files/components affected
- `src/components/earth/textures.ts`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Implement Day/Night twilight city lights blending shader in Earth.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / GLSL Shaders",
        "body": """### Problem
Earth shader fragment rendering currently lacks smooth transition blending between daytime continent textures and night-side city lights.

### Why it matters
A realistic day/night terminator line with illuminated night cities creates a cinematic space mission control aesthetic.

### Expected behaviour
`Earth.tsx` fragment shader should evaluate `dot(normal, sunDirection)` and smoothly blend day terrain with night lights across the twilight zone.

### Acceptance criteria
- [ ] Pass `uSunDirection` uniform to Earth fragment shader.
- [ ] Calculate smoothstep terminator transition based on dot product.
- [ ] Blend night city light emissive mask on night hemisphere.

### Likely files/components affected
- `src/components/earth/Earth.tsx`
- `src/components/earth/textures.ts`"""
    },
    {
        "title": "Implement volumetric cloud shadow casting in CloudLayer.tsx GLSL shader",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / GLSL Shaders",
        "body": """### Problem
`CloudLayer.tsx` renders an elevated cloud mesh, but clouds do not project shadows onto the underlying Earth surface.

### Why it matters
Cloud shadows cast on ocean and land textures add realistic 3D depth and atmosphere layer separation.

### Expected behaviour
Pass cloud noise texture sampling to the Earth fragment shader offset along the light direction vector to simulate cloud shadows.

### Acceptance criteria
- [ ] Sample cloud alpha texture in Earth fragment shader with light vector offset.
- [ ] Darken underlying Earth surface color where cloud shadow mask > 0.
- [ ] Verify performance remains smooth at 60 fps.

### Likely files/components affected
- `src/components/earth/CloudLayer.tsx`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Implement ocean specular reflection mask in Earth fragment shader",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / GLSL Shaders",
        "body": """### Problem
Direct sunlight produces equal specular reflections across ocean and land, causing continents to look unnaturally shiny.

### Why it matters
Land surfaces have low specular reflectivity while oceans produce sharp specular glints. A specular mask map corrects land highlights.

### Expected behaviour
The Earth fragment shader should sample a specular ocean mask, restricting specular highlight reflection calculations strictly to ocean pixels.

### Acceptance criteria
- [ ] Create `createProceduralOceanMask()` in `textures.ts`.
- [ ] Multiply specular intensity by ocean mask sample in Earth fragment shader.
- [ ] Verify realistic ocean glint effect under sun light rotation.

### Likely files/components affected
- `src/components/earth/textures.ts`
- `src/components/earth/Earth.tsx`"""
    },
    {
        "title": "Implement Rayleigh and Mie atmospheric light scattering shader in Atmosphere.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "3D / GLSL Shaders",
        "body": """### Problem
`Atmosphere.tsx` uses a simple fresnel falloff rim glow instead of physically based Rayleigh and Mie atmospheric scattering equations.

### Why it matters
Atmospheric light scattering produces realistic blue sky halos on the day side and warm orange sunset rims along the terminator line.

### Expected behaviour
Update `Atmosphere.tsx` GLSL shaders to approximate Rayleigh (blue wave scattering) and Mie (forward sun scattering) light equations.

### Acceptance criteria
- [ ] Implement Rayleigh scattering calculation based on sun angle in `Atmosphere.tsx`.
- [ ] Add Mie scattering forward glow when viewing towards the sun vector.
- [ ] Ensure smooth atmosphere rim rendering.

### Likely files/components affected
- `src/components/earth/Atmosphere.tsx`"""
    },
    {
        "title": "Implement interactive 3D camera bookmark presets in CameraController.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Frontend / 3D Controls",
        "body": """### Problem
Users can only focus the camera by clicking individual asteroids or returning to Earth. There are no quick preset camera view angles (North Pole, Equator, GEO Belt, Satellite Constellation).

### Why it matters
Camera presets allow operators to instantly jump to critical orbital operational zones.

### Expected behaviour
Add camera view preset buttons (Earth Overhead, LEO Ring, GEO Belt) triggering smooth camera lerps in `CameraController.tsx`.

### Acceptance criteria
- [ ] Add camera preset state actions in `store.tsx`.
- [ ] Implement lerp transitions in `CameraController.tsx` to preset coordinate targets.
- [ ] Render camera preset selector buttons in HUD Header.

### Likely files/components affected
- `src/components/CameraController.tsx`
- `src/components/Header.tsx`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Implement interactive 3D orbit maneuver burn planner widget in RightSidebar.tsx",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "Frontend / Interactive Feature",
        "body": """### Problem
`RightSidebar.tsx` currently displays static orbital parameters without allowing users to simulate orbit adjustment burns ($\\\\Delta v$).

### Why it matters
An interactive burn planner allows users to adjust prograde/retrograde velocity vectors and observe predicted orbit trajectory changes in real time.

### Expected behaviour
Add prograde/retrograde delta-V sliders in `RightSidebar.tsx` that compute new orbital semi-major axis and eccentricity parameters dynamically.

### Acceptance criteria
- [ ] Add delta-V input sliders in `RightSidebar.tsx`.
- [ ] Compute resulting orbit parameters $(a_{\\\\text{new}}, e_{\\\\text{new}})$ using `hohmannDeltaVKmPerSec`.
- [ ] Render target preview orbit line in 3D scene.

### Likely files/components affected
- `src/components/RightSidebar.tsx`
- `src/lib/kepler.ts`"""
    },
    {
        "title": "Implement orbital speed distribution histogram chart widget in LeftSidebar.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "Frontend / Data Visualization",
        "body": """### Problem
LeftSidebar lists asteroids in tabular format, but lacks a visual data summary showing how orbital velocities are distributed across the catalog.

### Why it matters
Visual histograms allow space situational awareness operators to quickly identify high-velocity orbital debris clusters.

### Expected behaviour
Render a responsive SVG/HTML bar chart histogram in `LeftSidebar.tsx` grouping asteroids into orbital velocity bins (0-5 km/s, 5-10 km/s, >10 km/s).

### Acceptance criteria
- [ ] Calculate velocity distribution bins from active orbital dataset.
- [ ] Render SVG bar chart widget in `LeftSidebar.tsx`.
- [ ] Filter catalog list when clicking a velocity histogram bin.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/components/SpeedHistogram.tsx`"""
    },
    {
        "title": "Implement interactive 3D distance measurement tool between space objects",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "Frontend / 3D Tools",
        "body": """### Problem
Users cannot measure the spatial distance in kilometers between two arbitrary selected space objects in the 3D scene.

### Why it matters
Measuring distances between active satellites and passing asteroids is essential for conjunction risk assessment.

### Expected behaviour
Allow selecting a primary and secondary object, rendering a 3D connecting line with distance text in scene units and kilometers.

### Acceptance criteria
- [ ] Support dual-object selection state in `store.tsx`.
- [ ] Render line between target 3D coordinates.
- [ ] Calculate and display spatial distance using `sceneUnitsToKm`.

### Likely files/components affected
- `src/components/DistanceMeasure.tsx`
- `src/components/Scene.tsx`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Implement satellite solar panel orientation animation in SatelliteSystem.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / Animation",
        "body": """### Problem
Satellite models rendered in `SatelliteSystem.tsx` remain static as they orbit Earth, with solar panels pointing in fixed directions.

### Why it matters
Real satellites actively rotate solar arrays to track the sun vector for maximum power generation.

### Expected behaviour
Rotate satellite solar panel mesh components in `SatelliteSystem.tsx` `useFrame` loop to continuously face the directional sun light vector.

### Acceptance criteria
- [ ] Calculate lookAt rotation matrix towards sun light vector.
- [ ] Apply smooth rotation to solar panel child meshes in `SatelliteSystem.tsx`.
- [ ] Confirm animation runs smoothly at 60 fps.

### Likely files/components affected
- `src/components/SatelliteSystem.tsx`
- `src/components/SolarPanel.tsx`"""
    },
    {
        "title": "Implement 3D space debris particle trail effect for decaying orbits in DebrisTrail.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "3D / VFX",
        "body": """### Problem
`DebrisTrail.tsx` is an 87-byte stub file. Space debris objects moving in Low Earth Orbit have no visual motion trails.

### Why it matters
Particle trails visually emphasize high-speed debris trajectories and decaying orbits.

### Expected behaviour
Render fading line trails behind fast-moving orbital debris instances using `THREE.BufferGeometry` or instanced line points.

### Acceptance criteria
- [ ] Store historical coordinate history for active debris objects in `DebrisTrail.tsx`.
- [ ] Render fading trail geometry along past trajectory positions.
- [ ] Provide performance toggle in `SettingsModal.tsx`.

### Likely files/components affected
- `src/components/DebrisTrail.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Implement full-screen cinematic presentation mode toggle in Header.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Presentation",
        "body": """### Problem
Header controls lack a quick button to hide all sidebar HUD overlays and enter full-screen browser mode for clean 3D viewing.

### Why it matters
Cinematic mode allows users to present 3D orbital views on external monitors or kiosks without UI clutter.

### Expected behaviour
Add a full-screen toggle button in `Header.tsx` that invokes the HTML5 Fullscreen API (`document.documentElement.requestFullscreen()`) and hides HUD sidebars.

### Acceptance criteria
- [ ] Add Fullscreen button to `Header.tsx`.
- [ ] Handle Fullscreen API browser cross-compatibility.
- [ ] Toggle HUD visibility on shortcut keypress (`F`).

### Likely files/components affected
- `src/components/Header.tsx`
- `src/components/FullscreenToggle.tsx`"""
    },
    {
        "title": "Implement orbital conjunction warning audio toggle in AudioToggle.tsx",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "UI / Audio",
        "body": """### Problem
`AudioToggle.tsx` is an 81-byte stub file. Conjunction alerts play visual toasts, but users have no control over sound effects or audio warning beeps.

### Why it matters
Audio indicators provide multimodal feedback for space situational awareness, but require an accessible mute toggle.

### Expected behaviour
`AudioToggle.tsx` should render an audio mute/unmute button and persist sound preference in local state.

### Acceptance criteria
- [ ] Create `AudioToggle.tsx` icon button in HUD Header.
- [ ] Synthesize subtle alert audio beeps using Web Audio API in `src/lib/audio.ts`.
- [ ] Persist audio toggle state in `AppSettingsProvider.tsx`.

### Likely files/components affected
- `src/components/AudioToggle.tsx`
- `src/lib/audio.ts`"""
    },
    {
        "title": "Implement customizable 3D viewport background themes (Deep Space, Nebula, Dark Void)",
        "labels": ["gssoc", "level:beginner", "type:feature"],
        "category": "3D / Customization",
        "body": """### Problem
`BackgroundThemes.tsx` is a 66-byte stub file. The 3D canvas background is restricted to a single static dark color.

### Why it matters
Allowing users to customize background space environments (Starfield, High-Contrast Black, Soft Nebula) improves visual user experience.

### Expected behaviour
Provide background theme options in `SettingsModal.tsx` that update the R3F canvas background color and starfield density.

### Acceptance criteria
- [ ] Create background theme selector in `SettingsModal.tsx`.
- [ ] Update canvas background in `Scene.tsx` dynamically.
- [ ] Support high-contrast black mode for accessibility.

### Likely files/components affected
- `src/components/BackgroundThemes.tsx`
- `src/components/Scene.tsx`
- `src/components/SettingsModal.tsx`"""
    },
    {
        "title": "Implement orbital debris hazard classification filter in LeftSidebar.tsx",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "category": "UI / Filtering",
        "body": """### Problem
`HazardFilter.tsx` is a 73-byte stub file. Users cannot filter the orbital catalog by risk hazard severity (Low, Medium, Critical).

### Why it matters
Space operators need to isolate high-risk debris objects passing near satellites without scrolling through 600 catalog items.

### Expected behaviour
Add hazard filter toggle buttons (All, Safe, Critical Hazard) in `LeftSidebar.tsx` filtering catalog items by conjunction proximity.

### Acceptance criteria
- [ ] Add `hazardLevel` filter state in `store.tsx`.
- [ ] Render hazard filter buttons in `LeftSidebar.tsx`.
- [ ] Filter active orbital list by risk proximity metrics.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`
- `src/components/HazardFilter.tsx`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Fix canvas container overflow causing unwanted horizontal scrollbars on mobile",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "UI / Mobile Bug",
        "body": """### Problem
On mobile viewports (< 640px), the 3D canvas container container element exceeds 100vw, triggering unwanted horizontal page scrolling.

### Why it matters
Horizontal page scrolling on mobile devices disrupts touch drag camera navigation and hides HUD control buttons off-screen.

### Expected behaviour
The canvas wrapper and page body should enforce `overflow-x: hidden` and `width: 100%` on mobile touch viewports.

### Acceptance criteria
- [ ] Apply `max-w-full overflow-x-hidden` in `src/app/page.tsx`.
- [ ] Ensure 3D viewport canvas scales cleanly on 320px-480px screen widths.
- [ ] Test touch camera drag without triggering horizontal document scroll.

### Likely files/components affected
- `src/app/page.tsx`
- `src/components/Scene.tsx`"""
    },
    {
        "title": "Fix missing key props in mapped HUD toast and catalog list elements",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Frontend / React Bug",
        "body": """### Problem
`Toasts.tsx` and `LeftSidebar.tsx` map over notification arrays without supplying unique `key` props, logging React console warnings.

### Why it matters
Missing `key` props cause inefficient DOM re-ordering and state reconciliation bugs during list updates.

### Expected behaviour
All array mapping functions rendering DOM lists should use stable, unique item identifiers (`item.id`).

### Acceptance criteria
- [ ] Add unique `key={toast.id}` in `Toasts.tsx`.
- [ ] Add unique `key={object.id}` in catalog list mapping in `LeftSidebar.tsx`.
- [ ] Verify zero React duplicate key warnings in console.

### Likely files/components affected
- `src/components/Toasts.tsx`
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Fix Supabase auth session listener memory leak on app re-render",
        "labels": ["gssoc", "level:intermediate", "type:bug"],
        "category": "Backend / Memory Leak Bug",
        "body": """### Problem
`src/lib/auth.ts` attaches `supabase.auth.onAuthStateChange` listeners inside `useEffect` without unsubscribing on component unmount.

### Why it matters
Un-subscribed auth state listeners accumulate on component re-renders, causing memory leaks and duplicate auth callback execution.

### Expected behaviour
The auth effect should capture subscription reference and invoke `subscription.unsubscribe()` in the effect cleanup function.

### Acceptance criteria
- [ ] Capture `{ data: { subscription } }` from `onAuthStateChange`.
- [ ] Return `() => subscription.unsubscribe()` in `useEffect` cleanup.
- [ ] Verify clean listener disposal in tests.

### Likely files/components affected
- `src/lib/auth.ts`
- `src/components/Auth.tsx`"""
    },
    {
        "title": "Fix keyboard shortcut listener triggering inside text input elements",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Accessibility / Keyboard Bug",
        "body": """### Problem
`KeyboardManager.tsx` listens to global `keydown` events. Typing the spacebar or 'R' key inside input fields triggers simulation pause or view reset actions.

### Why it matters
Shortcut triggers firing during text input prevent users from typing search queries or profile names normally.

### Expected behaviour
Keyboard listeners should inspect `event.target.tagName` and ignore events coming from `INPUT`, `TEXTAREA`, or `SELECT` elements.

### Acceptance criteria
- [ ] Add target element check in `KeyboardManager.tsx`.
- [ ] Ensure typing 'R' or 'Space' in search inputs does not pause simulation or reset camera.
- [ ] Verify standard keyboard shortcuts still work when input fields are blurred.

### Likely files/components affected
- `src/components/KeyboardManager.tsx`"""
    },
    {
        "title": "Fix incorrect scale factor conversion in kmToSceneUnits helper function",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Physics / Math Bug",
        "body": """### Problem
`kmToSceneUnits` in `src/lib/kepler.ts` multiplies instead of dividing by `KM_PER_UNIT`, producing scene-unit scale values thousands of times larger than Earth's radius.

### Why it matters
Incorrect kilometer-to-scene unit conversions distort custom satellite orbit radii and break camera tracking lerp calculations.

### Expected behaviour
`kmToSceneUnits(km)` should divide kilometers by `KM_PER_UNIT` (3543 km/unit).

### Acceptance criteria
- [ ] Fix `kmToSceneUnits` equation in `src/lib/kepler.ts` (`return km / KM_PER_UNIT`).
- [ ] Add unit test verifying `kmToSceneUnits(3543)` returns `1.0`.
- [ ] Verify `npm run test` passes.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/lib/__tests__/kepler.test.ts`"""
    },
    {
        "title": "Fix invalid state update on unmounted component in Toast notification manager",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "React Architecture / Bug",
        "body": """### Problem
`ToastManager.tsx` invokes `setToastList` inside delayed `setTimeout` callbacks after the notification component has unmounted, throwing React memory leak warnings.

### Why it matters
Updating state on unmounted components wastes CPU cycles and generates console warnings in React 19.

### Expected behaviour
`ToastManager` should track component mount status with a boolean ref or clear pending timeout timers on unmount.

### Acceptance criteria
- [ ] Track mounted status using `isMountedRef` in `ToastManager.tsx`.
- [ ] Clear pending auto-dismiss timeouts in `useEffect` cleanup.
- [ ] Verify clean component unmounting without React state warnings.

### Likely files/components affected
- `src/components/ToastManager.tsx`
- `src/components/Toasts.tsx`"""
    },
    {
        "title": "Fix audio context initialization error on browser startup",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "Audio / Web API Bug",
        "body": """### Problem
`src/lib/audio.ts` attempts to instantiate `new AudioContext()` immediately on module load before any user interaction, causing browser console autoplay policy errors.

### Why it matters
Modern web browsers block Web Audio API context creation prior to explicit user gestures (click or keypress).

### Expected behaviour
`AudioContext` initialization should be deferred until the user first clicks an interactive UI control or toggles sound.

### Acceptance criteria
- [ ] Lazily instantiate `AudioContext` inside user gesture handler in `src/lib/audio.ts`.
- [ ] Resume suspended audio contexts on first user click.
- [ ] Eliminate autoplay warning logs in browser console.

### Likely files/components affected
- `src/lib/audio.ts`
- `src/components/AudioToggle.tsx`"""
    },
    {
        "title": "Fix broken scroll position reset when switching tabs in LeftSidebar.tsx",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "UI / UX Bug",
        "body": """### Problem
Switching between 'All Objects', 'Near-Earth Asteroids', and 'Space Debris' tabs in `LeftSidebar.tsx` maintains the previous tab's scroll offset instead of resetting to top.

### Why it matters
Persisting scrolled offsets when opening a new catalog tab causes users to land in the middle of a list without seeing top items.

### Expected behaviour
Tab selection updates should reset catalog list container `scrollTop` to `0`.

### Acceptance criteria
- [ ] Add `ref` to catalog list container in `LeftSidebar.tsx`.
- [ ] Reset `containerRef.current.scrollTop = 0` when `activeTab` changes.
- [ ] Verify smooth tab switching UX.

### Likely files/components affected
- `src/components/LeftSidebar.tsx`"""
    },
    {
        "title": "Fix z-fighting flickering artifact on Earth atmosphere rim mesh",
        "labels": ["gssoc", "level:beginner", "type:bug"],
        "category": "3D / WebGL Rendering Bug",
        "body": """### Problem
The Earth atmosphere mesh in `Atmosphere.tsx` overlaps closely with `CloudLayer.tsx` mesh radius, causing flickering z-fighting visual artifacts on certain GPU drivers.

### Why it matters
Visual z-fighting flickering degrades 3D cinematic rendering quality.

### Expected behaviour
Adjust Atmosphere mesh radius scaling slightly and set `depthWrite={false}` with `renderOrder={2}` on Atmosphere material.

### Acceptance criteria
- [ ] Set `depthWrite={false}` on Atmosphere shader material.
- [ ] Configure explicit `renderOrder` on Earth, CloudLayer, and Atmosphere meshes.
- [ ] Verify zero flickering artifacts during camera rotations.

### Likely files/components affected
- `src/components/earth/Atmosphere.tsx`
- `src/components/earth/CloudLayer.tsx`"""
    },
    {
        "title": "Fix memory leak from un-disposed WebGL geometries and materials on unmount",
        "labels": ["gssoc", "level:intermediate", "type:bug"],
        "category": "3D / Memory Leak Bug",
        "body": """### Problem
`OrbitVisualizer.tsx` and custom mesh components instantiate Three.js `BufferGeometry` and `LineBasicMaterial` objects without disposing them when components unmount.

### Why it matters
Three.js geometries and materials allocated on GPU VRAM are not automatically freed by JavaScript garbage collection, leading to WebGL VRAM memory leaks.

### Expected behaviour
All custom Three.js geometries and materials should invoke `.dispose()` inside component unmount cleanup hooks.

### Acceptance criteria
- [ ] Add `useEffect` cleanup disposing `geometry.dispose()` and `material.dispose()` in `OrbitVisualizer.tsx`.
- [ ] Audit line and mesh components in `src/components/` for missing `.dispose()` calls.
- [ ] Verify WebGL memory stability using Chrome DevTools Memory profiler.

### Likely files/components affected
- `src/components/OrbitVisualizer.tsx`
- `src/components/DebrisTrail.tsx`"""
    },
    {
        "title": "Implement Newton-Raphson iteration initial guess optimization in solveKepler",
        "labels": ["gssoc", "level:advanced", "type:performance"],
        "category": "Performance / Physics Math",
        "body": """### Problem
`solveKepler` in `src/lib/kepler.ts` uses a basic initial guess $E_0 = M$, taking 6-12 Newton-Raphson iterations to converge for high eccentricity orbits ($e > 0.5$).

### Why it matters
Executing 12 iteration steps per object across 600 orbital instances per frame adds unnecessary mathematical overhead.

### Expected behaviour
Implement a robust initial seed guess $E_0 = M + e \\sin(M) + \\frac{e^2}{2} \\sin(2M)$ that converges in 2-3 iterations.

### Acceptance criteria
- [ ] Update initial guess logic in `solveKepler` in `src/lib/kepler.ts`.
- [ ] Maintain numerical tolerance threshold $\\\\le 1e-7$.
- [ ] Verify all unit tests in `src/lib/__tests__/kepler.test.ts` pass cleanly.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/lib/__tests__/kepler.test.ts`"""
    },
    {
        "title": "Implement Keplerian true anomaly conversion functions in src/lib/kepler.ts",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Math / Refactoring",
        "body": """### Problem
`src/lib/kepler.ts` computes eccentric anomaly $E$, but lacks helper functions to derive true anomaly $\\\\nu$ (nu) and orbital radius $r(\\\\nu)$.

### Why it matters
True anomaly is required for accurate orbital position telemetry readouts in `RightSidebar.tsx`.

### Expected behaviour
Export `eccentricToTrueAnomaly(E: number, e: number): number` and `orbitalRadiusAtTrueAnomaly(a: number, e: number, nu: number): number`.

### Acceptance criteria
- [ ] Add `eccentricToTrueAnomaly` helper using $\\\\tan(\\\\nu/2) = \\\\sqrt{\\\\frac{1+e}{1-e}} \\\\tan(E/2)$.
- [ ] Write unit tests verifying true anomaly calculation at periapsis ($\\\\nu=0$) and apoapsis ($\\\\nu=\\\\pi$).
- [ ] Export helpers in `src/lib/kepler.ts`.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/lib/__tests__/kepler.test.ts`"""
    },
    {
        "title": "Implement J2 orbital nodal precession calculation in kepler.ts",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "category": "Physics / Orbital Mechanics",
        "body": """### Problem
Earth's oblateness (J2 perturbation) causes satellite orbits to precess in Right Ascension of the Ascending Node (RAAN) over time, but AstroDex currently simulates un-perturbed Keplerian orbits.

### Why it matters
Including Earth's J2 gravitational perturbation models realistic nodal precession for Low Earth Orbit satellites like ISS.

### Expected behaviour
Implement `j2NodalPrecessionRate(aKm: number, e: number, incRad: number): number` calculating $\\\\dot{\\\\Omega}$ in radians/second.

### Acceptance criteria
- [ ] Add J2 perturbation calculation in `src/lib/kepler.ts` using $J_2 = 1.08263e-3$.
- [ ] Apply RAAN precession delta to satellite orbital orientation in `SatelliteSystem.tsx`.
- [ ] Write unit tests for J2 precession calculation.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/components/SatelliteSystem.tsx`"""
    },
    {
        "title": "Implement orbital inclination matrix transformation utility in src/lib/kepler.ts",
        "labels": ["gssoc", "level:intermediate", "type:refactor"],
        "category": "Math / Mechanics",
        "body": """### Problem
Perifocal coordinate transformation into 3D space coordinates is duplicated across `AsteroidField.tsx` and `SatelliteSystem.tsx`.

### Why it matters
Duplicating 3D coordinate transformation math creates maintenance hazards when updating orbital coordinate axes.

### Expected behaviour
Centralize 3D coordinate rotation into `getOrbitalPosition(a, e, E, incRad, raanRad)` in `src/lib/kepler.ts`.

### Acceptance criteria
- [ ] Export `getOrbitalPosition` function in `src/lib/kepler.ts`.
- [ ] Refactor `AsteroidField.tsx` and `SatelliteSystem.tsx` to call `getOrbitalPosition`.
- [ ] Write unit tests verifying spatial position calculations.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/components/AsteroidField.tsx`
- `src/components/SatelliteSystem.tsx`"""
    },
    {
        "title": "Implement orbital period calculator helper function in src/lib/kepler.ts",
        "labels": ["gssoc", "level:beginner", "type:refactor"],
        "category": "Math / Refactoring",
        "body": """### Problem
Calculating orbital period $T = 2\\pi \\sqrt{\\frac{a^3}{\\mu}}$ is performed inline inside UI inspector components instead of using a standard helper function.

### Why it matters
Centralizing physical period calculations ensures consistent period readouts (in minutes/hours) across HUD sidebar panels.

### Expected behaviour
Export `orbitalPeriodSeconds(aKm: number): number` and `formatOrbitalPeriod(seconds: number): string`.

### Acceptance criteria
- [ ] Implement `orbitalPeriodSeconds` in `src/lib/kepler.ts`.
- [ ] Format output string (e.g. \"92.6 min\" for LEO, \"23.9 hrs\" for GEO).
- [ ] Write unit tests verifying orbital period calculations.

### Likely files/components affected
- `src/lib/kepler.ts`
- `src/components/RightSidebar.tsx`"""
    },
    {
        "title": "Create standardized Pull Request description template in .github/PULL_REQUEST_TEMPLATE.md",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Project Tooling",
        "body": """### Problem
Contributors currently submit PRs with freeform descriptions, often omitting linked issue numbers, testing evidence, or screenshots.

### Why it matters
A structured PR template enforces PR guidelines (linking `Fixes #123`, checking test status, adding screenshots for UI changes).

### Expected behaviour
Create `.github/PULL_REQUEST_TEMPLATE.md` with structured sections for Summary, Type of Change, Linked Issue, Verification Steps, and Screenshots.

### Acceptance criteria
- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`.
- [ ] Include checklist for `npm run typecheck`, `npm run test`, and `npm run lint`.
- [ ] Verify GitHub automatically populates new PR forms with the template.

### Likely files/components affected
- `.github/PULL_REQUEST_TEMPLATE.md`"""
    },
    {
        "title": "Set up automated dependency vulnerability alert Webhook notification workflow",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Security Automation",
        "body": """### Problem
`.github/workflows/vuln-alert.yml` is an 85-byte stub file that does not dispatch security vulnerability notifications to maintainers.

### Why it matters
Maintainers require instant notifications when new security vulnerabilities are published against dependencies in `package.json`.

### Expected behaviour
Configure `.github/workflows/vuln-alert.yml` to run daily npm vulnerability audits and send alert notifications on failure.

### Acceptance criteria
- [ ] Populate `.github/workflows/vuln-alert.yml` with scheduled cron trigger (`0 0 * * *`).
- [ ] Run `npm audit --audit-level=high`.
- [ ] Create workflow failure alert when high vulnerabilities are detected.

### Likely files/components affected
- `.github/workflows/vuln-alert.yml`"""
    },
    {
        "title": "Add automated PR assignment validation step in .github/workflows/pr-assignment.yml",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Workflow Automation",
        "body": """### Problem
`.github/workflows/pr-assignment.yml` is a 76-byte placeholder. AstroDex rules require PR authors to have an assigned linked issue before opening a PR.

### Why it matters
Automated assignment validation prevents contributors from submitting unassigned PRs or sniping work assigned to other contributors.

### Expected behaviour
`pr-assignment.yml` should check if the PR author is assigned to the linked GitHub issue, commenting a warning if unassigned.

### Acceptance criteria
- [ ] Update `.github/workflows/pr-assignment.yml` with GitHub Actions job.
- [ ] Parse linked issue from PR body (`Fixes #123`).
- [ ] Verify PR author matches issue assignee login.

### Likely files/components affected
- `.github/workflows/pr-assignment.yml`"""
    },
    {
        "title": "Create standalone release automation workflow with semantic-release",
        "labels": ["gssoc", "level:intermediate", "type:ci"],
        "category": "DevOps / CI/CD Pipelines",
        "body": """### Problem
`.github/workflows/semantic-release.yml` is an 85-byte stub file without automated version tagging rules.

### Why it matters
Automating release versioning and changelog publishing on merges to `main` saves maintainer time and ensures consistent semantic version tags (`v1.2.0`).

### Expected behaviour
`semantic-release.yml` should run `cycjimmy/semantic-release-action` on pushes to `main`, generating GitHub releases and updating `CHANGELOG.md`.

### Acceptance criteria
- [ ] Populate `.github/workflows/semantic-release.yml`.
- [ ] Configure Conventional Commit release rules (`feat` -> minor, `fix` -> patch).
- [ ] Generate release notes automatically.

### Likely files/components affected
- `.github/workflows/semantic-release.yml`
- `.releaserc.json`"""
    },
    {
        "title": "Add automated merge conflict detection workflow in .github/workflows/merge-conflict.yml",
        "labels": ["gssoc", "level:beginner", "type:ci"],
        "category": "DevOps / Workflow Automation",
        "body": """### Problem
`.github/workflows/merge-conflict.yml` is an 82-byte stub file. Open pull requests can silently accumulate merge conflicts as `main` advances.

### Why it matters
Flagging merge conflicts automatically with a label (`has-conflicts`) alerts contributors to rebase their branches promptly.

### Expected behaviour
`merge-conflict.yml` should run periodically or on PR updates using `eps1lon/actions-label-merge-conflict` to apply the `has-conflicts` label.

### Acceptance criteria
- [ ] Populate `.github/workflows/merge-conflict.yml`.
- [ ] Apply `has-conflicts` label when a PR cannot be cleanly merged.
- [ ] Remove label automatically when conflicts are resolved.

### Likely files/components affected
- `.github/workflows/merge-conflict.yml`"""
    }
]

print(f"Total proposed Batch 2 issues: {len(batch2_issues)}")

created_count = 0
dup_count = 0
for idx, issue in enumerate(batch2_issues, 51):
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
    
    print(f"[{idx}/100] Creating issue: {issue['title']} (Labels: {issue['labels']})")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        created_count += 1
        existing_titles.add(t_lower)
        print(f"  -> Created successfully: {res.stdout.strip()}")
    else:
        print(f"  -> Failed: {res.stderr.strip()}")
    time.sleep(0.5)

print(f"\nBatch 2 Summary: Created {created_count} issues. Skipped {dup_count} duplicates.")
