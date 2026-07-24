import subprocess
import time
import random
import json

verbs = [
    "Refactor", "Optimize", "Add unit tests for", 
    "Improve accessibility of", "Update styling for", 
    "Fix edge cases in", "Add error handling to", 
    "Improve performance of", "Write inline documentation for",
    "Audit memory leaks in", "Migrate", "Enhance", "Review", 
    "Update dependencies for", "Create E2E tests for", 
    "Standardize formatting in", "Fix race conditions in", 
    "Modernize", "Decouple", "Consolidate",
    "Analyze", "Simplify", "Redesign", "Write integration tests for", 
    "Profile", "Instrument", "Automate", "Validate", 
    "Verify", "Tweak", "Revamp", "Rearchitect", "Sandbox"
]

components = [
    "EarthMesh component", "CloudLayer shader", "Atmosphere rendering",
    "Asteroid InstancedMesh", "Kepler orbit solver", "Conjunction tracker",
    "Claim Button UI", "Settings Modal", "Mobile Navbar",
    "WebGL Loading Spinner", "React Error Boundary", "Toast Notifications",
    "Supabase Auth flow", "Supabase RLS policies", "Scene Content provider",
    "AppProvider context", "Camera Lerp logic", "Vis-Viva speed calculation",
    "Procedural texture generator", "Asteroid data fetching hook",
    "Orbit visualizer", "Post-processing Bloom", "Post-processing Vignette", 
    "WebGL context configuration", "Next.js routing layer", "User profile modal", 
    "Leaderboard UI", "Asteroid detail panel", "Canvas 2D texture pipeline", 
    "Supabase real-time subscriptions", "Tooltip component", "Loading skeleton UI", 
    "Keyboard shortcut manager", "Local storage cache", "CSS token system",
    "Three.js materials", "Three.js geometries", "Collision detection logic", 
    "Framerate monitor", "GLSL shaders", "Data pipeline", "REST API wrapper", 
    "Supabase client module", "Next.js Image components", "Asset preloader", 
    "Font loader", "Loading screen", "Onboarding flow", "Settings state manager", 
    "Controls overlay", "Planet shader", "Zoom controls"
]

reasons = [
    "to improve frame rates on lower-end devices.",
    "to ensure better maintainability for future contributors.",
    "to align with modern React best practices.",
    "to prevent potential race conditions during state updates.",
    "to reduce the overall Next.js bundle size.",
    "to provide a smoother user experience on mobile.",
    "to handle unexpected API timeouts gracefully.",
    "to improve keyboard navigation and screen reader support.",
    "to make the 3D scene feel more cinematic.",
    "to ensure strict type safety across the codebase.",
    "to prepare for upcoming feature additions.",
    "to resolve intermittent layout shift issues.",
    "to reduce the cognitive load for new open-source contributors.",
    "to adhere strictly to the GSSoC guidelines.",
    "to make debugging easier in production.",
    "to improve Lighthouse SEO scores.",
    "to handle high concurrency smoothly."
]

labels_pool = [
    ["gssoc", "gssoc:approved", "enhancement", "ui"],
    ["gssoc", "gssoc:approved", "enhancement", "3d", "performance"],
    ["gssoc", "gssoc:approved", "refactor", "react"],
    ["gssoc", "gssoc:approved", "bug", "math"],
    ["gssoc", "gssoc:approved", "documentation", "good first issue"],
    ["gssoc", "gssoc:approved", "security", "devops"],
    ["gssoc", "gssoc:approved", "testing", "ci/cd"],
    ["gssoc", "gssoc:approved", "accessibility", "ui"]
]

# Fetch existing issues to avoid duplicates
used_titles = set()
print("Fetching existing issues to avoid duplicates...")
try:
    res = subprocess.run(
        ["gh", "issue", "list", "--limit", "1000", "--json", "title"],
        capture_output=True, text=True, check=True
    )
    data = json.loads(res.stdout)
    for issue in data:
        used_titles.add(issue["title"])
    print(f"Loaded {len(used_titles)} existing issue titles.")
except Exception as e:
    print("Failed to fetch existing issues, proceeding with empty set:", e)


issues = []
print("Generating 200 new unique issues...")
# Generate 200 unique issues
attempts = 0
while len(issues) < 200 and attempts < 10000:
    attempts += 1
    v = random.choice(verbs)
    c = random.choice(components)
    r = random.choice(reasons)
    title = f"{v} the {c}"
    
    if title not in used_titles:
        used_titles.add(title)
        body = f"As part of our ongoing improvements, we need to {v.lower()} the {c} {r}\n\nPlease check the corresponding files in `src/` and ensure your changes do not break existing functionality. Leave a comment below if you'd like to be assigned to this task!"
        
        # Pick relevant labels based on component
        if "shader" in c or "Mesh" in c or "Camera" in c or "texture" in c or "WebGL" in c or "Bloom" in c or "Vignette" in c or "Orbit" in c or "Three.js" in c or "Planet" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "3d"]
        elif "Supabase" in c or "Auth" in c or "REST" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "security"]
        elif "orbit" in c or "speed" in c or "tracker" in c or "Collision" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "math"]
        else:
            label = random.choice(labels_pool)
            
        issues.append({"title": title, "body": body, "labels": label})

if len(issues) < 200:
    print(f"Warning: Could only generate {len(issues)} unique issues after 10000 attempts.")

print(f"Prepared {len(issues)} more issues. Starting creation...")

for i, issue in enumerate(issues):
    cmd = [
        "gh", "issue", "create",
        "--title", issue["title"],
        "--body", issue["body"],
        "--label", ",".join(issue["labels"]),
    ]
    
    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"[{i+1}/{len(issues)}] Created: {issue['title']}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create issue {i+1}: {e.stderr}")
    
    time.sleep(1.5)

print(f"Finished creating {len(issues)} more issues!")
