# AstroDex Open Source Contribution Guide — GitHub Issues Spec

Below are 10 structured GitHub issue templates you can copy and paste directly to the repository issues tracker to invite contributions.

---

## 1. [UI/UX] Implement LocalStorage persistence for Mining Claims

- **Difficulty**: Easy 🟢
- **Description**: Currently, when a user clicks the "File Mining Claim" or "Release Mining Claim" buttons on the Inspector card, the state resides only in the React Context memory. Refreshing the browser resets all claims.
- **Expected Behavior**: Save claimed asteroid/debris IDs to `localStorage` on claim/release, and load them during state initialization.
- **Suggested Files**:
  - [src/lib/store.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/lib/store.tsx)

---

## 2. [Realism] Enhance Earth Night-Lights Shader

- **Difficulty**: Medium 🟡
- **Description**: The current procedural Earth textures generate a static night-lights pattern. We want to add realistic urban cluster distributions (e.g. brighter regions over North America, Europe, East Asia) and tint the night city lights with a warmer sodium-yellow temperature glow instead of neutral white.
- **Expected Behavior**: Night texture shader should look more realistic with warm glowing city clusters.
- **Suggested Files**:
  - [src/components/earth/textures.ts](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/earth/textures.ts)
  - [src/components/earth/Earth.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/earth/Earth.tsx)

---

## 3. [Realism] Add Cloud Shadows and Height Displacement

- **Difficulty**: Medium 🟡
- **Description**: The Earth cloud layer rendered in `CloudLayer.tsx` sits directly above the Earth mesh. To add visual depth, we should cast subtle dark shadows from the clouds onto the Earth day texture based on the sun direction, and add a small vertex shader displacement to make the cloud layer feel elevated.
- **Expected Behavior**: A faint dark offset replica of the cloud map is projected onto the Earth day shader based on `sunDirection`, making the atmosphere look 3D.
- **Suggested Files**:
  - [src/components/earth/CloudLayer.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/earth/CloudLayer.tsx)
  - [src/components/earth/Earth.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/earth/Earth.tsx)

---

## 4. [Constraints] Implement delta-V (Δv) Budget Solver Logic

- **Difficulty**: Hard 🔴
- **Description**: The Planner Constraints inputs (Max total Δv, Max burns) are currently cosmetic. We want to implement a simplified coplanar orbital transfer solver (Hohmann Transfer) that calculates the actual delta-V required to move the manual satellite from its current altitude to a target asteroid's orbit.
- **Expected Behavior**: When clicking "Apply" in the constraints planner, the console or terminal logs the calculated Δv budget required to meet the selected asteroid, and flags a warning if the required Δv exceeds the user's "Max total Δv" constraint.
- **Suggested Files**:
  - [src/components/RightSidebar.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/RightSidebar.tsx)
  - [src/lib/store.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/lib/store.tsx)

---

## 5. [UI/UX] Add Preset Trajectory Buttons for Satellites

- **Difficulty**: Easy 🟢
- **Description**: Users looking to simulate satellite paths in the Right Sidebar must enter numeric parameters (Altitude, Inclination, RAAN) manually. Adding quick-preset buttons for famous satellite constellations will make the dashboard more interactive.
- **Expected Behavior**: Add buttons like "GPS Constellation", "Starlink LEO", "Geostationary (GEO)", and "Molniya Orbit" that automatically populate the input fields with standard parameters and upload the trajectory.
- **Suggested Files**:
  - [src/components/RightSidebar.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/RightSidebar.tsx)

---

## 6. [UI/UX] Implement Interactive Input Validation

- **Difficulty**: Easy 🟢
- **Description**: The input fields in the sidebars lack validation. For instance, putting a letters string or an inclination greater than 360° is accepted, which causes rendering bugs in the 3D scene.
- **Expected Behavior**: Prevent letters input, restrict inclination to `[0, 180]`, altitude to `[100, 40000]`, and RAAN to `[0, 360]`. Show red inline feedback text for invalid entries.
- **Suggested Files**:
  - [src/components/RightSidebar.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/RightSidebar.tsx)

---

## 7. [Sound] Add Ambient Soundscape & Dynamic Beeps

- **Difficulty**: Easy 🟢
- **Description**: To make AstroDex feel like a premium, cinematic command center, we want to add a toggleable, low-volume ambient space hum / synthesizer background sound, along with subtle "beep-click" audio feedback when selecting objects or loading trajectories.
- **Expected Behavior**: Soundscape mute/unmute control in the header bar. Volume kept low (under 15%) for subtle immersion.
- **Suggested Files**:
  - [src/components/Header.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/Header.tsx)
  - [src/app/page.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/app/page.tsx)

---

## 8. [Performance] Implement Frustum Culling on Orbit Trails

- **Difficulty**: Medium 🟡
- **Description**: As the camera tracks selected asteroids or zooms in close, orbit rings that are completely off-screen are still evaluated by WebGL. We should implement frustum culling or dynamically hide the satellite orbit lines and inactive instances when they are not in the camera viewport.
- **Expected Behavior**: Improved frame-rate on mobile devices and low-tier laptops during close-up inspection zooms.
- **Suggested Files**:
  - [src/components/SatelliteSystem.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/SatelliteSystem.tsx)
  - [src/components/AsteroidField.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/AsteroidField.tsx)

---

## 9. [UI/UX] Add Mobile HUD Overlay Adaptation

- **Difficulty**: Medium 🟡
- **Description**: Currently, the HUD layouts assume a desktop viewport. On screens under 768px wide, the sidebars overflow and cover the Earth globe entirely, rendering the experience unusable.
- **Expected Behavior**: On mobile layouts, collapse both sidebars by default, and introduce a bottom navigation bar with icons ("Targets", "Viewport", "Parameters") to toggle panels slide-over screens one at a time.
- **Suggested Files**:
  - [src/app/page.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/app/page.tsx)
  - [src/app/globals.css](file:///Users/sourabhpatne16/Desktop/AstroDex/src/app/globals.css)

---

## 10. [Realism] Render Debris/Asteroid Trail Paths

- **Difficulty**: Hard 🔴
- **Description**: Finding close approaches is hard because objects travel on invisible orbits. Rendering a faint, dotted orbital path for the _currently selected_ asteroid or debris particle will help users visualize why a close approach is occurring.
- **Expected Behavior**: When an item is selected in the inspector, draw a faint dashed ellipse representing its orbital ellipse around Earth. Hide it when selection is cleared.
- **Suggested Files**:
  - [src/components/AsteroidField.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/AsteroidField.tsx)
  - [src/components/Scene.tsx](file:///Users/sourabhpatne16/Desktop/AstroDex/src/components/Scene.tsx)
