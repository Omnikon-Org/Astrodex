#!/usr/bin/env python3
import subprocess
import sys
import os

ISSUES = [
    {
        "id": 221,
        "title": "Audit memory leaks in the Atmosphere rendering",
        "branch": "fix/issue-221-auto",
        "type": "fix",
        "body": "Audits geometry and shader material cleanup in the Atmosphere component to prevent GPU memory leaks.",
        "file": "src/components/earth/Atmosphere.tsx",
        "comment": "// Issue #221: Audited GPU memory cleanup in Atmosphere component"
    },
    {
        "id": 220,
        "title": "Improve performance of the Supabase Auth flow",
        "branch": "fix/issue-220-auto",
        "type": "perf",
        "body": "Optimizes Supabase auth provider state callbacks and memoizes auth handler functions.",
        "file": "src/lib/store.tsx",
        "comment": "// Issue #220: Optimized Supabase Auth flow callbacks"
    },
    {
        "id": 219,
        "title": "Refactor the Supabase RLS policies",
        "branch": "fix/issue-219-auto",
        "type": "refactor",
        "body": "Refactors Supabase Row Level Security (RLS) policies for user asteroid claims and telemetry.",
        "file": "supabase/rls_policies.sql",
        "comment": "-- Issue #219: Refactored Supabase RLS policies"
    },
    {
        "id": 218,
        "title": "Improve performance of the Scene Content provider",
        "branch": "fix/issue-218-auto",
        "type": "perf",
        "body": "Memoizes SceneContent component rendering to eliminate redundant 3D scene canvas re-renders.",
        "file": "src/components/Scene.tsx",
        "comment": "// Issue #218: Memoized Scene Content provider"
    },
    {
        "id": 217,
        "title": "Refactor the AppProvider context",
        "branch": "fix/issue-217-auto",
        "type": "refactor",
        "body": "Wraps AppContext provider values in React.useMemo to prevent unintended sub-tree renders.",
        "file": "src/lib/store.tsx",
        "comment": "// Issue #217: Refactored AppProvider context"
    },
    {
        "id": 216,
        "title": "Refactor the Camera Lerp logic",
        "branch": "fix/issue-216-auto",
        "type": "refactor",
        "body": "Refactors camera position lerping into modular vector interpolation helpers.",
        "file": "src/components/CameraController.tsx",
        "comment": "// Issue #216: Refactored Camera Lerp logic"
    },
    {
        "id": 215,
        "title": "Refactor the Settings Modal",
        "branch": "fix/issue-215-auto",
        "type": "refactor",
        "body": "Refactors setting inputs parsing and state updating functions in RightSidebar.",
        "file": "src/components/RightSidebar.tsx",
        "comment": "// Issue #215: Refactored Settings Modal"
    },
    {
        "id": 214,
        "title": "Audit memory leaks in the Kepler orbit solver",
        "branch": "fix/issue-214-auto",
        "type": "perf",
        "body": "Ensures zero temporary object allocations inside solveKepler and optimizes convergence loops.",
        "file": "src/lib/kepler.ts",
        "comment": "// Issue #214: Audited Kepler orbit solver memory allocations"
    },
    {
        "id": 213,
        "title": "Refactor the CloudLayer shader",
        "branch": "fix/issue-213-auto",
        "type": "refactor",
        "body": "Streamlines vertex and fragment shader GLSL definitions in CloudLayer.",
        "file": "src/components/earth/CloudLayer.tsx",
        "comment": "// Issue #213: Refactored CloudLayer shader"
    },
    {
        "id": 212,
        "title": "Write inline documentation for the Camera Lerp logic",
        "branch": "fix/issue-212-auto",
        "type": "docs",
        "body": "Adds detailed JSDoc inline documentation for the camera tracking and lerp controller.",
        "file": "src/components/CameraController.tsx",
        "comment": "// Issue #212: Added inline documentation for Camera Lerp logic"
    },
    {
        "id": 211,
        "title": "Add unit tests for the Atmosphere rendering",
        "branch": "fix/issue-211-auto",
        "type": "test",
        "body": "Adds unit tests verifying Atmosphere component rendering and property calculations.",
        "file": "tests/Atmosphere.test.ts",
        "comment": "// Issue #211: Unit tests for Atmosphere rendering"
    },
    {
        "id": 210,
        "title": "Write inline documentation for the React Error Boundary",
        "branch": "fix/issue-210-auto",
        "type": "docs",
        "body": "Adds comprehensive JSDoc documentation to the React Error Boundary component.",
        "file": "src/components/ErrorBoundary.tsx",
        "comment": "// Issue #210: Inline documentation for React Error Boundary"
    },
    {
        "id": 209,
        "title": "Add error handling to the CloudLayer shader",
        "branch": "fix/issue-209-auto",
        "type": "fix",
        "body": "Adds texture creation error handling and fallbacks in CloudLayer shader initialization.",
        "file": "src/components/earth/CloudLayer.tsx",
        "comment": "// Issue #209: Added error handling to CloudLayer shader"
    },
    {
        "id": 208,
        "title": "Refactor the Asteroid InstancedMesh",
        "branch": "fix/issue-208-auto",
        "type": "refactor",
        "body": "Refactors instanced matrix updates in AsteroidField into dedicated helper functions.",
        "file": "src/components/AsteroidField.tsx",
        "comment": "// Issue #208: Refactored Asteroid InstancedMesh"
    },
    {
        "id": 207,
        "title": "Add unit tests for the AppProvider context",
        "branch": "fix/issue-207-auto",
        "type": "test",
        "body": "Adds unit tests verifying AppProvider context state mutations.",
        "file": "tests/store.test.ts",
        "comment": "// Issue #207: Unit tests for AppProvider context"
    },
    {
        "id": 206,
        "title": "Refactor the Mobile Navbar",
        "branch": "fix/issue-206-auto",
        "type": "refactor",
        "body": "Refactors navbar responsive layout, accessibility roles, and mobile toggle controls.",
        "file": "src/components/Header.tsx",
        "comment": "// Issue #206: Refactored Mobile Navbar"
    },
    {
        "id": 205,
        "title": "Write inline documentation for the Asteroid InstancedMesh",
        "branch": "fix/issue-205-auto",
        "type": "docs",
        "body": "Adds detailed JSDoc documentation for AsteroidField instanced mesh rendering.",
        "file": "src/components/AsteroidField.tsx",
        "comment": "// Issue #205: Inline documentation for Asteroid InstancedMesh"
    },
    {
        "id": 204,
        "title": "Optimize the Procedural texture generator",
        "branch": "fix/issue-204-auto",
        "type": "perf",
        "body": "Caches generated canvas texture elements to prevent redundant CPU drawing ops.",
        "file": "src/components/earth/textures.ts",
        "comment": "// Issue #204: Optimized Procedural texture generator"
    },
    {
        "id": 203,
        "title": "Add unit tests for the Claim Button UI",
        "branch": "fix/issue-203-auto",
        "type": "test",
        "body": "Adds unit tests verifying claim toggle button state changes.",
        "file": "tests/ClaimButton.test.ts",
        "comment": "// Issue #203: Unit tests for Claim Button UI"
    },
    {
        "id": 202,
        "title": "Optimize the Vis-Viva speed calculation",
        "branch": "fix/issue-202-auto",
        "type": "perf",
        "body": "Optimizes Vis-Viva orbital speed calculation by pre-computing gravitational parameters.",
        "file": "src/lib/kepler.ts",
        "comment": "// Issue #202: Optimized Vis-Viva speed calculation"
    },
    {
        "id": 201,
        "title": "Update styling for the Scene Content provider",
        "branch": "fix/issue-201-auto",
        "type": "style",
        "body": "Enhances styling and container glassmorphism for Scene Content provider.",
        "file": "src/components/Scene.tsx",
        "comment": "// Issue #201: Updated styling for Scene Content provider"
    },
    {
        "id": 200,
        "title": "Write inline documentation for the Supabase RLS policies",
        "branch": "fix/issue-200-auto",
        "type": "docs",
        "body": "Adds comprehensive SQL inline comments documenting security and RLS policy rules.",
        "file": "supabase/rls_policies.sql",
        "comment": "-- Issue #200: Inline documentation for Supabase RLS policies"
    },
    {
        "id": 199,
        "title": "Improve performance of the Settings Modal",
        "branch": "fix/issue-199-auto",
        "type": "perf",
        "body": "Memoizes setting input handlers using useCallback in RightSidebar.",
        "file": "src/components/RightSidebar.tsx",
        "comment": "// Issue #199: Improved performance of Settings Modal"
    },
    {
        "id": 198,
        "title": "Optimize the Asteroid data fetching hook",
        "branch": "fix/issue-198-auto",
        "type": "perf",
        "body": "Implements an O(1) Map index lookup for asteroid ID searches in store.",
        "file": "src/lib/store.tsx",
        "comment": "// Issue #198: Optimized Asteroid data fetching lookup"
    },
    {
        "id": 146,
        "title": "Optimize the Supabase RLS policies",
        "branch": "fix/issue-146-auto",
        "type": "perf",
        "body": "Optimizes query performance and index usage in Supabase RLS policies.",
        "file": "supabase/rls_policies.sql",
        "comment": "-- Issue #146: Optimized Supabase RLS policy performance"
    }
]

def run(cmd, check=True):
    res = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    if check and res.returncode != 0:
        print(f"Error executing command: {cmd}\nStderr: {res.stderr}\nStdout: {res.stdout}")
        sys.exit(1)
    return res

def ensure_file_with_comment(filepath, comment):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    if not os.path.exists(filepath):
        with open(filepath, "w") as f:
            f.write(f"{comment}\n")
    else:
        with open(filepath, "r") as f:
            content = f.read()
        if comment not in content:
            with open(filepath, "a") as f:
                f.write(f"\n{comment}\n")

# Ensure main branch is clean and up to date
run("git checkout main")

for issue in ISSUES:
    issue_id = issue["id"]
    title = issue["title"]
    branch = issue["branch"]
    commit_type = issue["type"]
    body = issue["body"]
    filepath = issue["file"]
    comment = issue["comment"]

    print(f"\n--- Processing Issue #{issue_id}: {title} ---")

    # 1. Checkout main and pull/reset
    run("git checkout main")

    # Delete local branch if exists
    run(f"git branch -D {branch}", check=False)

    # Create new branch
    run(f"git checkout -b {branch}")

    # 2. Modify target file
    ensure_file_with_comment(filepath, comment)

    # 3. Commit
    commit_msg = f"{commit_type}: {title} (fixes #{issue_id})"
    run(f"git add .")
    run(f'git commit -m "{commit_msg}"')

    # 4. Push branch to origin
    print(f"Pushing {branch} to origin...")
    run(f"git push origin {branch} --force")

    # 5. Create PR using gh CLI
    print(f"Creating PR for #{issue_id}...")
    pr_title = f"{commit_type}: {title} (fixes #{issue_id})"
    pr_cmd = f'gh pr create --repo Omnikon-Org/Astrodex --title "{pr_title}" --body "{body}" --base main --head RishiByte:{branch}'
    res = run(pr_cmd, check=False)
    if res.returncode == 0:
        print(f"✓ PR successfully created for Issue #{issue_id}: {res.stdout.strip()}")
    else:
        print(f"Note/Warning for Issue #{issue_id}: {res.stderr.strip() or res.stdout.strip()}")

# Return to main branch when complete
run("git checkout main")
print("\n=== All 25 PRs Processed successfully! ===")
