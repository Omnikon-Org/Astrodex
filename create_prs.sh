#!/bin/bash

# issue 188
git checkout fix/issue-188-auto
gh pr create --repo Omnikon-Org/Astrodex --title "fix: Fix edge cases in the Settings Modal (fixes #188)" --body "Fixes parsing edge cases in RightSidebar settings." --base main --head fix/issue-188-auto

# issue 197
git checkout fix/issue-197-auto
gh pr create --repo Omnikon-Org/Astrodex --title "test: Add unit tests for the Settings Modal (fixes #197)" --body "Adds unit tests for RightSidebar." --base main --head fix/issue-197-auto

# issue 196
git checkout fix/issue-196-auto
gh pr create --repo Omnikon-Org/Astrodex --title "fix: Improve accessibility of the Asteroid InstancedMesh (fixes #196)" --body "Adds accessibility features to Asteroid InstancedMesh." --base main --head fix/issue-196-auto

# issue 195
git checkout fix/issue-195-auto
gh pr create --repo Omnikon-Org/Astrodex --title "fix: Improve accessibility of the Camera Lerp logic (fixes #195)" --body "Improves CameraController accessibility with keyboard navigation." --base main --head fix/issue-195-auto

# issue 192 & 194
git checkout fix/issue-192-194-auto
gh pr create --repo Omnikon-Org/Astrodex --title "feat: WebGL Loading Spinner Error Handling & Docs (fixes #194, fixes #192)" --body "Creates WebGLFallback component." --base main --head fix/issue-192-194-auto

# issue 193
git checkout fix/issue-193-auto
gh pr create --repo Omnikon-Org/Astrodex --title "fix: Add error handling to Supabase RLS (fixes #193)" --body "Adds 2026_rls_policies.sql." --base main --head fix/issue-193-auto

# issue 191
git checkout fix/issue-191-auto
gh pr create --repo Omnikon-Org/Astrodex --title "fix: Improve accessibility of the Supabase Auth flow (fixes #191)" --body "Fixes auth page accessibility." --base main --head fix/issue-191-auto

# issue 189, 186, 169
git checkout fix/issue-189-186-169-auto
gh pr create --repo Omnikon-Org/Astrodex --title "feat: React Error Boundary Memory Leaks & Performance (fixes #189, fixes #186, fixes #169)" --body "Adds ErrorBoundary to the 3D scene." --base main --head fix/issue-189-186-169-auto

git checkout main
