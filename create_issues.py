import subprocess
import time
import json
import random

issues = [
    # UI / Components
    {"title": "Implement responsive navbar for mobile devices", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "The current navbar breaks on smaller screens. We need to implement a hamburger menu for mobile devices and ensure smooth transitions."},
    {"title": "Add skeleton loaders for asteroid data fetching", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "While fetching asteroid data from the API/Supabase, the UI feels unresponsive. Add a skeleton loader to indicate data is being fetched."},
    {"title": "Improve dark mode color palette", "labels": ["gssoc", "gssoc:approved", "enhancement", "design"], "body": "The current dark mode colors lack contrast. We need to update the color tokens in Tailwind configuration for better readability."},
    {"title": "Add tooltips to orbital parameters", "labels": ["gssoc", "gssoc:approved", "enhancement", "good first issue"], "body": "Users may not understand terms like 'eccentricity' or 'mean anomaly'. Add tooltips with brief explanations when hovering over these labels."},
    {"title": "Create a unified settings modal", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Consolidate volume, graphics, and account settings into a single modal dialogue with tabs."},
    {"title": "Implement custom scrollbars", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Replace the default browser scrollbars with custom CSS scrollbars that match the space theme."},
    {"title": "Add pagination to the asteroid catalog list", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "The catalog list can become very long. Implement pagination or infinite scrolling for better performance."},
    {"title": "Design a dedicated 404 Not Found page", "labels": ["gssoc", "gssoc:approved", "enhancement", "design"], "body": "Create a space-themed custom 404 page for invalid routes."},
    {"title": "Add a 'Return to Earth' reset button", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Add a UI button that instantly resets the camera view back to focus on Earth."},
    {"title": "Improve toast notification animations", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "The current toast notifications (e.g. after claiming) appear abruptly. Add entry and exit animations using Framer Motion or CSS."},
    {"title": "Add sort options for the asteroid catalog", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Allow sorting the catalog by distance, size, or claim status."},
    {"title": "Implement a search bar for asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Add a text search to find specific asteroids by name or ID in the catalog."},
    {"title": "Add a toggle for UI visibility (Cinematic Mode)", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Allow users to hide all HTML UI elements to just view the 3D scene cleanly."},
    {"title": "Display live coordinate data for selected object", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Show the current XYZ coordinates (or Right Ascension/Declination) of the selected object in the sidebar."},
    {"title": "Add an interactive mini-map", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Create a 2D top-down mini-map in the corner showing the Earth and nearby selected asteroids."},
    {"title": "Implement onboarding tour for new users", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Use a library like react-joyride to guide first-time users on how to navigate the 3D scene and claim asteroids."},
    {"title": "Fix alignment on the claim submission form", "labels": ["gssoc", "gssoc:approved", "bug", "ui"], "body": "The input fields and submit button on the claim form are slightly misaligned on medium screens."},
    {"title": "Add confirmation dialog before releasing a claim", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Prevent accidental unclaiming by showing a confirmation prompt."},
    {"title": "Enhance focus states for keyboard navigation", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Ensure all interactive UI elements have clear, visible focus rings for keyboard users."},
    {"title": "Add internationalization (i18n) framework", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Set up next-intl or similar to support multiple languages, starting with English and Spanish."},

    # 3D / R3F / Graphics
    {"title": "Implement LOD (Level of Detail) for asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d", "performance"], "body": "To support more than 600 asteroids, implement LOD so distant asteroids use lower-poly geometries."},
    {"title": "Add asteroid rotation around their own axes", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Asteroids currently orbit but don't spin. Add angular velocity (spin) to the instances in useFrame."},
    {"title": "Create a lens flare effect for the sun", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Add a realistic lens flare post-processing effect when looking towards the light source."},
    {"title": "Improve Earth atmosphere shader scattering", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Tweak the Rayleigh scattering coefficients in the Earth shader for a more realistic sunset rim."},
    {"title": "Add dynamic starfield background", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Replace the static background color with a generated starfield using points and a custom shader."},
    {"title": "Implement orbital trails for claimed asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Render a thin line (using Line2 or similar) tracing the orbit path of an asteroid when it is selected."},
    {"title": "Optimize instanced mesh color updates", "labels": ["gssoc", "gssoc:approved", "enhancement", "performance"], "body": "Batch setColorAt calls and ensure instanceMatrix/instanceColor needsUpdate is only set when actual changes occur."},
    {"title": "Add subtle camera shake on high-speed camera transitions", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "When flying rapidly to a newly selected asteroid, add a minor procedural camera shake for cinematic effect."},
    {"title": "Implement a space debris debris field near LEO", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Generate a secondary InstancedMesh for smaller, faster-moving space junk in Low Earth Orbit."},
    {"title": "Add post-processing chromatic aberration", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Add subtle chromatic aberration around the edges of the screen using @react-three/postprocessing."},
    {"title": "Create procedural normal maps for asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Instead of using generic normal maps, generate random noise normal maps per asteroid or use a varying shader."},
    {"title": "Implement frustum culling for distant objects", "labels": ["gssoc", "gssoc:approved", "enhancement", "performance"], "body": "Ensure objects entirely outside the camera view do not consume expensive update logic, if possible with instancing."},
    {"title": "Add Day/Night cycle to Earth textures", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Blend between a day texture and a night (city lights) texture based on the light vector in the Earth fragment shader."},
    {"title": "Improve clouds shadow mapping on Earth", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Make the CloudLayer cast soft shadows onto the underlying Earth mesh for depth."},
    {"title": "Add selectable satellite models", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "Introduce a few detailed 3D models of famous satellites (e.g., ISS, Hubble) that can be tracked."},
    {"title": "Implement an orbit speed multiplier control", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Add a slider to increase/decrease the simulation speed of Keplerian orbits."},
    {"title": "Add visual indicators for conjunctions", "labels": ["gssoc", "gssoc:approved", "enhancement", "3d"], "body": "When two objects pass dangerously close, highlight them with a brief red pulse or connecting line."},
    {"title": "Fix z-fighting on Earth atmosphere edges", "labels": ["gssoc", "gssoc:approved", "bug", "3d"], "body": "Adjust the depthWrite and rendering order of the Atmosphere mesh to prevent flickering against clouds."},
    {"title": "Add custom cursors when hovering selectable 3D objects", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Change the CSS cursor to a pointer or target reticle when the raycaster hits an interactive asteroid."},
    {"title": "Implement double-click to focus object", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Currently, it might take a single click. Add double-click functionality to trigger the camera tracking lerp."},

    # Logic / Math / Kepler
    {"title": "Refine the Vis-Viva velocity calculation", "labels": ["gssoc", "gssoc:approved", "bug", "math"], "body": "Ensure the current speed string generation correctly handles the scene unit to km conversion before displaying."},
    {"title": "Add orbital inclination to Kepler solver", "labels": ["gssoc", "gssoc:approved", "enhancement", "math"], "body": "Currently orbits might be co-planar. Introduce inclination (i) and longitude of ascending node (Ω) to the 3D solver."},
    {"title": "Implement precise LEO orbital decay math", "labels": ["gssoc", "gssoc:approved", "enhancement", "math"], "body": "For objects in LEO, slowly decrease their semi-major axis over time based on atmospheric drag approximations."},
    {"title": "Add real-time conjunction detection worker", "labels": ["gssoc", "gssoc:approved", "enhancement", "performance"], "body": "Move the conjunction detection (N^2 distance checks) into a Web Worker to avoid blocking the main thread."},
    {"title": "Create utility functions for astronomical unit (AU) conversion", "labels": ["gssoc", "gssoc:approved", "enhancement", "math"], "body": "Add helpers in `kepler.ts` to convert between AU, km, and scene units for easier data ingestion."},
    {"title": "Add hyperbolic orbit support", "labels": ["gssoc", "gssoc:approved", "enhancement", "math"], "body": "Allow for eccentricity >= 1 to simulate comets or interstellar objects passing through."},
    {"title": "Cache eccentric anomaly iterative solutions", "labels": ["gssoc", "gssoc:approved", "enhancement", "performance"], "body": "If the mean anomaly change is small, use the previous frame's eccentric anomaly as the initial guess for Newton-Raphson."},
    {"title": "Fix division by zero at exact periapsis in speed calculation", "labels": ["gssoc", "gssoc:approved", "bug", "math"], "body": "Add a small epsilon when calculating the radius denominator to prevent NaN errors."},
    {"title": "Generate more varied initial orbital parameters", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Update `generateOrbitalObjectData` to produce distinct groups (e.g., Near-Earth, Main Belt style)."},
    {"title": "Implement true anomaly calculation output", "labels": ["gssoc", "gssoc:approved", "enhancement", "math"], "body": "Expose true anomaly in the UI for the selected object, derived from the eccentric anomaly."},

    # Backend / Supabase
    {"title": "Set up Supabase Row Level Security (RLS)", "labels": ["gssoc", "gssoc:approved", "enhancement", "security"], "body": "Ensure the claims table has strict RLS policies so users can only modify their own claims."},
    {"title": "Create a leaderboard for most claims", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Fetch and display an aggregated list of users with the most claimed asteroids."},
    {"title": "Add user authentication via GitHub/Google", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Integrate Supabase Auth to allow real user sign-ins before claiming an asteroid."},
    {"title": "Implement optimistic UI updates for claims", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "When claiming, update the local React Context state immediately while the Supabase request runs in the background."},
    {"title": "Add user avatars to claimed asteroids tooltip", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Fetch the claiming user's profile picture from Supabase and display it in the 3D scene label."},
    {"title": "Handle Supabase network timeouts gracefully", "labels": ["gssoc", "gssoc:approved", "bug"], "body": "Add error catching and toast notifications if the upsert claim request fails or times out."},
    {"title": "Create a user profile page", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Build a route `/profile` that lists all asteroids currently claimed by the authenticated user."},
    {"title": "Implement real-time claim syncing across clients", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Use Supabase Realtime subscriptions to update asteroid colors instantly when another user claims one."},
    {"title": "Add a 'claim history' log", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Maintain an append-only log table in Supabase of all claim/unclaim events and show a feed."},
    {"title": "Rate limit claim requests", "labels": ["gssoc", "gssoc:approved", "enhancement", "security"], "body": "Prevent users from spamming the claim button by adding a debounce or backend rate limit policy."},

    # Code Quality / Next.js / Tools
    {"title": "Migrate global CSS to Tailwind utility classes where possible", "labels": ["gssoc", "gssoc:approved", "enhancement", "refactor"], "body": "Clean up `index.css` by moving generic layout styles into Tailwind classes in components."},
    {"title": "Add ESLint rules for React Hooks", "labels": ["gssoc", "gssoc:approved", "enhancement", "tooling"], "body": "Ensure `eslint-plugin-react-hooks` is properly configured and fix any existing violations."},
    {"title": "Enforce strict TypeScript checks", "labels": ["gssoc", "gssoc:approved", "enhancement", "typescript"], "body": "Set `strict: true` in tsconfig.json and resolve any explicit `any` types."},
    {"title": "Set up Prettier for automated formatting", "labels": ["gssoc", "gssoc:approved", "enhancement", "tooling"], "body": "Add a `.prettierrc` and a format script, and ensure it runs on pre-commit via husky."},
    {"title": "Refactor Three.js object instancing into a custom hook", "labels": ["gssoc", "gssoc:approved", "enhancement", "refactor"], "body": "Extract the complex `setMatrixAt` logic out of the component body into a reusable `useAsteroids` hook."},
    {"title": "Implement Error Boundaries for 3D Canvas", "labels": ["gssoc", "gssoc:approved", "enhancement", "react"], "body": "Wrap the R3F Canvas in a React Error Boundary to show a fallback UI if WebGL crashes."},
    {"title": "Optimize Next.js font loading", "labels": ["gssoc", "gssoc:approved", "enhancement", "performance"], "body": "Ensure `next/font` is properly configured to preload critical fonts and avoid layout shift."},
    {"title": "Add bundle size analyzer", "labels": ["gssoc", "gssoc:approved", "enhancement", "tooling"], "body": "Include `@next/bundle-analyzer` to track the size of Three.js and post-processing imports."},
    {"title": "Create a reusable Tooltip component", "labels": ["gssoc", "gssoc:approved", "enhancement", "refactor"], "body": "Abstract the repetitive tooltip HTML into a shared `<Tooltip>` React component."},
    {"title": "Clean up unused dependencies in package.json", "labels": ["gssoc", "gssoc:approved", "enhancement", "tooling"], "body": "Audit the dependencies and remove any libraries that are no longer imported in the code."},

    # Accessibility (a11y)
    {"title": "Add aria-labels to all icon buttons", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Ensure screen readers can interpret icon-only buttons (like settings or close buttons)."},
    {"title": "Ensure sufficient color contrast in text panels", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Run an a11y audit and adjust text/background colors to meet WCAG AA standards."},
    {"title": "Provide text alternatives for WebGL canvas", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Add off-screen text or a descriptive fallback inside the Canvas tag for screen reader users."},
    {"title": "Support keyboard navigation for 3D selection", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Allow users to tab through the asteroid catalog and press enter to focus the camera on them."},
    {"title": "Add a 'reduce motion' preference toggle", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Respect the user's OS prefers-reduced-motion setting by disabling aggressive camera sweeps and bloom animations."},
    {"title": "Implement semantic HTML in the layout", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Replace excessive `<div>` tags with `<header>`, `<main>`, `<aside>`, and `<section>`."},
    {"title": "Fix focus trapping in modals", "labels": ["gssoc", "gssoc:approved", "accessibility", "bug"], "body": "When the settings modal is open, ensure the tab key circles within the modal and doesn't focus background elements."},
    {"title": "Add screen reader announcements for claims", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Use an aria-live region to announce when an asteroid has been successfully claimed."},
    {"title": "Ensure form inputs have linked labels", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "All inputs in the claim or settings form must have an associated `<label>` element with `htmlFor`."},
    {"title": "Audit ARIA roles across custom UI elements", "labels": ["gssoc", "gssoc:approved", "accessibility"], "body": "Review the usage of `role='button'`, `role='dialog'`, etc., and ensure they have the required keyboard event handlers."},

    # SEO & Meta
    {"title": "Add dynamic Open Graph meta tags", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Implement Next.js metadata API to generate nice preview images and descriptions for social sharing."},
    {"title": "Create a sitemap.xml", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Automatically generate a sitemap using Next.js tools for better search engine indexing."},
    {"title": "Add robots.txt file", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Configure a standard robots.txt to guide web crawlers."},
    {"title": "Optimize site title and description", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Update the default Next.js metadata to accurately reflect the 'Interactive 3D asteroid explorer' branding."},
    {"title": "Implement JSON-LD structured data", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Add structured data representing the web application for richer search results."},
    {"title": "Ensure proper heading hierarchy", "labels": ["gssoc", "gssoc:approved", "seo", "accessibility"], "body": "Make sure the page has exactly one H1, and H2/H3 follow a logical structure."},
    {"title": "Add canonical URLs", "labels": ["gssoc", "gssoc:approved", "enhancement", "seo"], "body": "Prevent duplicate content issues by adding canonical link tags to the main pages."},
    {"title": "Implement Favicons and Apple Touch Icons", "labels": ["gssoc", "gssoc:approved", "enhancement", "design"], "body": "Add a complete set of high-res icons for various devices and browsers."},
    {"title": "Add descriptive alt text to all UI images", "labels": ["gssoc", "gssoc:approved", "accessibility", "seo"], "body": "Ensure any standard `<img>` tags or Next Image components have proper alt text."},
    {"title": "Optimize LCP (Largest Contentful Paint)", "labels": ["gssoc", "gssoc:approved", "performance", "seo"], "body": "Ensure the WebGL canvas initialization doesn't block the initial page layout too long."},

    # Documentation
    {"title": "Write a comprehensive README.md", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Expand the README to include setup instructions, tech stack details, and contribution guidelines."},
    {"title": "Add an Architecture section to docs", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Document how React Context, R3F, and Supabase communicate within the app."},
    {"title": "Create a CONTRIBUTING.md guide", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Provide clear steps on how open-source contributors can fork, branch, and submit PRs."},
    {"title": "Document the Kepler math formulas", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Add inline comments in `kepler.ts` explaining the specific astronomical equations used."},
    {"title": "Create a shader explanation guide", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Write a short markdown file explaining how the custom Earth GLSL shaders work."},
    {"title": "Add JSDoc comments to store context", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Document the state variables and action functions in `store.tsx`."},
    {"title": "Create a 'Troubleshooting' wiki page", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "List common WebGL or Next.js development errors and their solutions."},
    {"title": "Document environment variables setup", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Create an `.env.example` file and explain how to get Supabase keys."},
    {"title": "Add a Code of Conduct", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Include a standard `CODE_OF_CONDUCT.md` file for community safety."},
    {"title": "Create Issue templates", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Add `.github/ISSUE_TEMPLATE` files for bug reports and feature requests."},
    {"title": "Create Pull Request template", "labels": ["gssoc", "gssoc:approved", "documentation"], "body": "Add a `.github/PULL_REQUEST_TEMPLATE.md` with a checklist for contributors."},

    # Testing
    {"title": "Set up Jest and React Testing Library", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Initialize a testing environment capable of handling Next.js and basic component rendering."},
    {"title": "Write unit tests for Kepler math functions", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Add test coverage for `solveKepler`, `meanMotion`, and `visViva` using known astronomical data."},
    {"title": "Implement basic end-to-end (E2E) tests with Playwright", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Create a simple test suite that loads the page and clicks a few UI elements."},
    {"title": "Test React Context store logic", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Write tests verifying that claiming and unclaiming update the local state correctly."},
    {"title": "Add snapshot tests for UI components", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Use Jest to snapshot the static layout components like Navbar and Footer."},
    {"title": "Mock Supabase calls in test environment", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Set up a standard mock for the Supabase client so tests don't hit the real database."},
    {"title": "Test distance calculation edge cases", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Ensure the conjunction logic doesn't crash when distances approach zero."},
    {"title": "Write tests for formatting utilities", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Verify that numbers are correctly formatted with commas and proper units (km/s)."},
    {"title": "Set up GitHub Actions for CI testing", "labels": ["gssoc", "gssoc:approved", "testing", "ci/cd"], "body": "Create a workflow that runs `npm test` and `npm run lint` on every PR."},
    {"title": "Add test coverage reporting", "labels": ["gssoc", "gssoc:approved", "testing"], "body": "Configure Jest to output coverage reports and enforce a minimum percentage."},
    
    # Extra (Filling up to 100)
    {"title": "Add automated dependency updates", "labels": ["gssoc", "gssoc:approved", "ci/cd"], "body": "Configure Dependabot or Renovate to keep npm packages up to date."},
    {"title": "Create a Dockerfile for easy self-hosting", "labels": ["gssoc", "gssoc:approved", "enhancement", "devops"], "body": "Add a multi-stage Dockerfile to build and serve the Next.js app."},
    {"title": "Implement a staging environment deployment", "labels": ["gssoc", "gssoc:approved", "ci/cd"], "body": "Set up a Vercel preview deployment workflow for PRs."},
    {"title": "Add a 'Share' button for specific asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Allow users to copy a link with query parameters (e.g. `?id=123`) that auto-focuses on load."},
    {"title": "Support query params for initial camera target", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Read URL search params on mount and instantly lerp the camera to the specified asteroid."},
    {"title": "Implement a timeline scrubber", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Allow users to drag a slider to fast-forward or rewind orbital positions in time."},
    {"title": "Add sound effects for UI interactions", "labels": ["gssoc", "gssoc:approved", "enhancement", "audio"], "body": "Include subtle futuristic clicks when selecting items or claiming."},
    {"title": "Implement a background ambient space track", "labels": ["gssoc", "gssoc:approved", "enhancement", "audio"], "body": "Add an audio element with looping ambient music, including a mute toggle."},
    {"title": "Add 3D positional audio for asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement", "audio"], "body": "Attach PositionalAudio to close passing objects for a 'whoosh' effect."},
    {"title": "Optimize WebGL context lost recovery", "labels": ["gssoc", "gssoc:approved", "bug", "3d"], "body": "Handle 'webglcontextlost' events by displaying a user-friendly error and a reload button."},
    {"title": "Implement an 'Auto-Tour' mode", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Create a button that automatically cycles the camera through random interesting asteroids every 10 seconds."},
    {"title": "Add categorisation tags to asteroids", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Visually distinguish between 'Debris', 'Near Earth Object', and 'Main Belt' using colors or icons."},
    {"title": "Create a dashboard for global stats", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Show total claims, active users, and closest approaches on a separate dashboard view."},
    {"title": "Add a feature request feedback form", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Provide a simple form for users to suggest new features, linked to a Supabase table."},
    {"title": "Implement a 'Report an Issue' UI button", "labels": ["gssoc", "gssoc:approved", "enhancement"], "body": "Link directly to the GitHub issues page with pre-filled parameters."},
    {"title": "Support touch gestures for orbit controls", "labels": ["gssoc", "gssoc:approved", "enhancement", "mobile"], "body": "Ensure pinch-to-zoom and two-finger pan work smoothly on touch devices."},
    {"title": "Fix layout shift during font loading", "labels": ["gssoc", "gssoc:approved", "bug", "ui"], "body": "Use font-display: swap and specify proper fallback fonts to avoid CLS."},
    {"title": "Implement a custom loading screen", "labels": ["gssoc", "gssoc:approved", "enhancement", "ui"], "body": "Instead of a blank white screen, show a space-themed loading spinner while WebGL initializes."},
    {"title": "Add WebXR support for VR headsets", "labels": ["gssoc", "gssoc:approved", "enhancement", "experimental"], "body": "Use @react-three/xr to allow viewing the solar system in Virtual Reality."},
]

components = ['Navbar', 'Sidebar', 'Footer', 'Claim Modal', 'Settings Panel', 'Tooltip', 'Asteroid List', 'Scene Viewer', 'Header', 'Login Form']
actions = ['Improve padding in', 'Fix hover state for', 'Update border radius on', 'Add transition to', 'Refactor CSS classes in', 'Fix text alignment in']

while len(issues) < 100:
    c = random.choice(components)
    a = random.choice(actions)
    issues.append({
        "title": f"{a} {c}",
        "labels": ["gssoc", "gssoc:approved", "ui", "good first issue"],
        "body": f"Minor UI enhancement: We need to {a.lower()} the {c} component to match the updated design guidelines. Please check Tailwind classes."
    })

issues = issues[:100]

print(f"Creating {len(issues)} issues...")

for i, issue in enumerate(issues):
    title = issue['title']
    body = issue['body']
    labels = ",".join(issue['labels'])
    
    cmd = [
        "gh", "issue", "create",
        "--title", title,
        "--body", body,
        "--label", labels,
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"[{i+1}/100] Created: {title}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create issue {i+1}: {e.stderr}")
    
    time.sleep(1.5)

print("Done!")
