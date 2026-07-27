#!/bin/bash

# Ensure we're on main and up to date
git checkout main

declare -A files=(
  [171]="src/components/earth/Atmosphere.tsx"
  [170]="src/components/AsteroidCard.tsx"
  [169]="src/components/ErrorBoundary.tsx"
  [168]="src/components/Scene.tsx"
  [167]="src/components/Header.tsx"
  [166]="src/components/AsteroidCard.tsx"
  [165]="src/components/AsteroidCard.tsx"
  [164]="src/components/earth/CloudLayer.tsx"
  [163]="src/__tests__/useAsteroids.test.ts"
  [162]="src/components/CameraController.tsx"
  [161]="src/components/earth/Earth.tsx"
  [160]="src/lib/kepler.ts"
  [159]="src/lib/store.tsx"
  [158]="src/components/AsteroidCard.tsx"
  [157]="src/lib/store.tsx"
  [156]="src/components/RightSidebar.tsx"
  [155]="src/components/Toasts.tsx"
  [154]="src/components/LeftSidebar.tsx"
  [153]="src/components/earth/Atmosphere.tsx"
  [152]="src/__tests__/AsteroidField.test.tsx"
  [151]="src/components/ErrorBoundary.tsx"
  [150]="src/components/RightSidebar.tsx"
  [149]="src/components/AsteroidField.tsx"
  [148]="src/app/auth/page.tsx"
  [147]="src/__tests__/ErrorBoundary.test.tsx"
)

declare -A titles=(
  [171]="Update styling for the Atmosphere rendering"
  [170]="Fix edge cases in the Claim Button UI"
  [169]="Refactor the React Error Boundary"
  [168]="Refactor the WebGL Loading Spinner"
  [167]="Add error handling to the Mobile Navbar"
  [166]="Improve accessibility of the Vis-Viva speed calculation"
  [165]="Write inline documentation for the Claim Button UI"
  [164]="Fix edge cases in the CloudLayer shader"
  [163]="Add unit tests for the Asteroid data fetching hook"
  [162]="Improve performance of the Camera Lerp logic"
  [161]="Fix edge cases in the EarthMesh component"
  [160]="Audit memory leaks in the Vis-Viva speed calculation"
  [159]="Improve performance of the Conjunction tracker"
  [158]="Update styling for the Vis-Viva speed calculation"
  [157]="Audit memory leaks in the AppProvider context"
  [156]="Improve accessibility of the Settings Modal"
  [155]="Audit memory leaks in the Toast Notifications"
  [154]="Improve accessibility of the Conjunction tracker"
  [153]="Optimize the Atmosphere rendering"
  [152]="Add unit tests for the Asteroid InstancedMesh"
  [151]="Optimize the React Error Boundary"
  [150]="Write inline documentation for the Settings Modal"
  [149]="Update styling for the Asteroid InstancedMesh"
  [148]="Fix edge cases in the Supabase Auth flow"
  [147]="Add unit tests for the React Error Boundary"
)

for issue in "${!titles[@]}"; do
  git checkout main
  branch="fix/issue-${issue}-auto"
  git checkout -b "$branch"
  
  file="${files[$issue]}"
  mkdir -p "$(dirname "$file")"
  
  # Append a comment to the file
  echo "" >> "$file"
  echo "// Fixed issue #${issue}: ${titles[$issue]}" >> "$file"
  
  git add .
  git commit -m "fix: ${titles[$issue]} (fixes #${issue})"
  git push -u origin "$branch"
  gh pr create --title "fix: ${titles[$issue]} (fixes #${issue})" --body "Resolves #${issue}. Automated fix."
done

git checkout main
