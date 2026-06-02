# @AstroDex — Contributing Guidelines

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `npm install`
4. Start the dev server: `npm run dev`

## Code Style

- **TypeScript** — strict mode enabled. Avoid `any` unless absolutely necessary
- **Components** — use `"use client"` for any component using hooks or browser APIs
- **Imports** — use `@/` path alias (maps to `src/`)
- **Formatting** — ESLint config included; run `npm run lint` before committing
- **CSS** — Tailwind utility classes preferred. Custom CSS only for global resets

## Project Conventions

### File Organization

```
src/
  app/          # Next.js App Router pages and layouts
  components/   # React components
    earth/      # Earth-specific 3D components
  lib/          # Utilities, types, state
```

### 3D Components

- Shader code should be inlined as template literals (Next.js does not support `.glsl` imports)
- Uniforms should be created with `useRef` to avoid re-creating on every render
- Texture updates belong in `useEffect`, not `useMemo`
- Use `useCallback` for event handlers passed to InstancedMesh

### Naming

- Components: PascalCase
- Functions: camelCase
- Types/Interfaces: PascalCase
- Files: PascalCase for components, camelCase for utilities
- Shader variables: camelCase

## Pull Request Process

1. Create a feature branch (`feature/my-feature`)
2. Make your changes
3. Verify the project builds: `npm run build`
4. Open a PR with a clear description of changes

## Adding Real Textures

Drop images into `public/textures/` and update the import in `Earth.tsx`:

```tsx
import { useTexture } from "@react-three/drei"

const [dayMap, nightMap, specMap] = useTexture([
  "/textures/earth_day.jpg",
  "/textures/earth_night.jpg",
  "/textures/earth_specular.jpg",
])
```

## Future Supabase Setup

When integrating Supabase:

1. Create a `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
2. Create a `asteroids` table with columns: `id`, `asteroid_id`, `claimed_by`, `claimed_at`
3. Replace the mock `claimAsteroid` in `store.tsx` with a Supabase upsert
